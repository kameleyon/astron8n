"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Bookmark, MessageSquare, Calendar, Search, Star, Trash2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import SessionProvider from '@/components/SessionProvider';
import ChatHistoryLayout from '@/components/layouts/ChatHistoryLayout';

interface ChatSession {
  session_id: string;
  first_message: string;
  message_count: number;
  created_at: string;
  is_favorite?: boolean;
}

const ITEMS_PER_PAGE = 7;

export default function ChatHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadChatSessions();
  }, [showFavorites]);

  const loadChatSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const query = supabase
        .from('messages')
        .select(`
          session_id,
          content,
          created_at,
          is_favorite
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (showFavorites) {
        query.eq('is_favorite', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      const sessionMap = new Map<string, ChatSession>();
      
      data?.forEach(msg => {
        if (!sessionMap.has(msg.session_id)) {
          sessionMap.set(msg.session_id, {
            session_id: msg.session_id,
            first_message: msg.content,
            message_count: 1,
            created_at: msg.created_at,
            is_favorite: msg.is_favorite
          });
        } else {
          const session = sessionMap.get(msg.session_id)!;
          session.message_count++;
        }
      });

      setSessions(Array.from(sessionMap.values()));
      setCurrentPage(1); // Reset to first page when loading new data
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .update({ is_favorite: true })
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      loadChatSessions();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      loadChatSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const openSession = (sessionId: string) => {
    router.push(`/dashboard?session=${sessionId}`);
  };

  const filteredSessions = sessions.filter(session =>
    session.first_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <SessionProvider requireAuth>
      <ChatHistoryLayout>
      <main className="flex-grow relative z-10 py-4">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-left mb-8 pl-8">
              My Chat History
            </h1>
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                <Input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/40 text-primary placeholder-primary/70 border-white focus:border-white focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 text-primary">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showFavorites}
                    onChange={(e) => setShowFavorites(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>Show Favorites</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : paginatedSessions.length === 0 ? (
                <div className="text-center text-gray-500">No chat sessions found</div>
              ) : (
                <>
                  {paginatedSessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => openSession(session.session_id)}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4 flex-shrink-0" />
                            <span>{session.message_count}</span>
                          </div>
                          <p className="text-gray-900 truncate flex-1">{session.first_message}</p>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {format(new Date(session.created_at), 'MMM d')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => toggleFavorite(e, session.session_id)}
                            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                              session.is_favorite ? 'text-[#FFA600]' : 'text-gray-400'
                            }`}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => deleteSession(e, session.session_id)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-white text-primary hover:bg-primary/10'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>
      </ChatHistoryLayout>
    </SessionProvider>
  );
}

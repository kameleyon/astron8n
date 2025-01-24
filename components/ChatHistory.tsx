"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Bookmark, MessageSquare, Calendar, Search, Star, Trash2, ArrowLeft } from 'lucide-react';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';

interface ChatSession {
  session_id: string;
  first_message: string;
  message_count: number;
  created_at: string;
  is_favorite?: boolean;
}

const ITEMS_PER_PAGE = 6;

export default function ChatHistory() {
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
      if (!user) {
        router.push('/auth');
        return;
      }

      const query = supabase
        .from('messages')
        .select(`
          session_id,
          content,
          created_at,
          is_favorite,
          is_bot
        `)
        .eq('user_id', user.id)
        .eq('is_bot', false) // Only get user messages for preview
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

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 min-h-[calc(100vh-8rem)] max-w-full overflow-hidden mb-20">
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
          <Bookmark className="h-4 w-4" />
          Chat History
        </h2>
      </div>

      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 py-1.5 h-8 text-sm bg-white/40 border-gray-200"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={showFavorites}
              onChange={(e) => setShowFavorites(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-xs text-gray-600">Favorites</span>
          </label>

          <button className="text-xs text-gray-600 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Date</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center text-gray-500 py-4 text-sm">Loading...</div>
        ) : paginatedSessions.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">No chats found</div>
        ) : (
          <>
            {paginatedSessions.map((session) => (
              <div
                key={session.session_id}
                onClick={() => openSession(session.session_id)}
                className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-2.5 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-primary">
                      <MessageSquare className="h-3 w-3" />
                      <span>{session.message_count}</span>
                    </div>
                    <span className="text-gray-400">
                      {format(new Date(session.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-2 break-words">
                      {session.first_message}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-1">
                    <button
                      onClick={(e) => toggleFavorite(e, session.session_id)}
                      className={`p-1 -m-1 ${
                        session.is_favorite ? 'text-[#FFA600]' : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => deleteSession(e, session.session_id)}
                      className="p-1 -m-1 text-gray-300 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-1 mt-3 pt-2 border-t border-gray-100">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-6 h-6 text-xs rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
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
  );
}
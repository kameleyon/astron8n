"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Bookmark, MessageCircle, MessageSquare, Calendar, Search, Star, Trash2, ArrowLeft } from 'lucide-react';
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

const ITEMS_PER_PAGE = 5;

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
          <div className="chat-container backdrop-blur-md bg-white/30 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] mt-8 mb-8 h-[780px] min-h-auto w-full flex flex-col transition-all duration-300 rounded-3xl overflow-hidden font-questrial">
            {/* Header with gradient */}
            <div className="p-5 border-b border-white/20 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-md flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                My Chat History
              </h2>
              <button 
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-white/30 bg-white/20 rounded-full transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="p-4 bg-gradient-to-b from-white/10 to-white/5 border-b border-white/10">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white" />
                <Input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 h-10 text-md bg-white/20 border-white/50 rounded-full text-[#cd6301] placeholder-white"
                />
              </div>

              <div className="flex items-center justify-end">
                <label className="flex items-center gap-1.5 text-[#645b4b]">
                  <input
                    type="checkbox"
                    checked={showFavorites}
                    onChange={(e) => setShowFavorites(e.target.checked)}
                    className="h-4 w-4 rounded border-white"
                  />
                  <span className="text-sm text-[#cd6301]">Show Favorites</span>
                </label>
              </div>
            </div>

            <div className="flex-1  overflow-y-auto min-h-0 message-container  bg-gradient-to-b from-white/10 to-white/5">
              <div className="space-y-4  rounded-xl m-4 p-2 ">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-[#645b4b] py-4">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p>Loading your chat history...</p>
                    </div>
                  </div>
                ) : paginatedSessions.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-[#645b4b] py-4">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 text-primary/40" />
                      <p>No chats found</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {paginatedSessions.map((session) => (
                      <div
                        key={session.session_id}
                        onClick={() => openSession(session.session_id)}
                        className="p-2  text-[#645b4b] border-l border-5 border-primary rounded-r-xl backdrop-blur-lg  bg-white/30 hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in"
                      >
                        <div className="flex flex-col gap-2 ">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 font-semibold text-primary/80">
                              <MessageCircle className="h-4 w-4" />
                              <span>{session.message_count} messages</span>
                            </div>
                            <span className="text-[#645b4b] text-xs">
                              {format(new Date(session.created_at), 'MMM d, h:mm a')}
                            </span>
                            <div className="flex items-right justify-end gap-4 pt-1">
                            <button
                              onClick={(e) => toggleFavorite(e, session.session_id)}
                              className={`p-1.5 rounded-full ${
                                session.is_favorite 
                                  ? 'text-[#cd6301] bg-[#FFFFFF]/20' 
                                  : 'text-[#cd6301]/50 hover:bg-white/50'
                              }`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => deleteSession(e, session.session_id)}
                              className="p-1.5 rounded-full text-[#cd6301]/50 hover:bg-red-50 hover:text-cd6301"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[#645b4b] line-clamp-1 break-words">
                              {session.first_message}
                            </p>
                          </div>

                          
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-[#645b4b] disabled:opacity-50"
                  >
                    ◀
                  </button>
                  
                  <div className="h-1 bg-white/40 flex-grow mx-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    ></div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-[#645b4b] disabled:opacity-50"
                  >
                    ▶
                  </button>
                </div>
              </div>
            )}
            
            <style jsx>{`
              @keyframes message-in {
                0% {
                  opacity: 0;
                  transform: translateY(15px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fade-in {
                animation: message-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
                will-change: transform, opacity;
              }
              
              .message-container {
                background-image: 
                  radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
                background-size: 40px 40px;
              }
            `}</style>
          </div>
        </div>
      </main>
      </ChatHistoryLayout>
    </SessionProvider>
  );
}

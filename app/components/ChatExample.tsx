'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ChatExample() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户消息到对话
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // 调用我们的 API 端点
      const response = await axios.post('/api/chat', {
        messages: updatedMessages,
      });

      // 添加 AI 回复到对话
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: response.data.content }
      ]);
    } catch (err: unknown) {
      setError((err as Error).message || '请求出错，请重试');
      console.error('Chat request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAI 聊天示例</h1>
      
      {/* 对话记录 */}
      <div className="mb-4 border rounded-lg p-4 h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">开始对话吧...</p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded ${
                msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <p>{msg.content}</p>
            </div>
          ))
        )}
        {loading && <p className="text-gray-500 italic">正在思考...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      
      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入您的问题..."
          className="flex-1 p-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          发送
        </button>
      </form>
    </div>
  );
} 
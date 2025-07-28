import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../route';

// Mock the fetch function
global.fetch = jest.fn();

describe('Chat API Handler', () => {
    let mockReq: Partial<NextApiRequest>;
    let mockRes: Partial<NextApiResponse>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jsonMock,
        };
        mockReq = {
            method: 'POST',
            body: {
                message: 'Hello, how are you?',
                messages: [],
            },
        };
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('should return 405 for non-POST requests', async () => {
        mockReq.method = 'GET';
        await handler(mockReq as any, mockRes as any);
        expect(mockRes.status).toHaveBeenCalledWith(405);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'Method not allowed' });
    });

    it('should handle successful chat completion', async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({
                choices: [{ message: { content: 'I am doing well, thank you!' } }]
            })
        };
        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        await handler(mockReq as any, mockRes as any);

        expect(global.fetch).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: 'Hello, how are you?' }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ 
            message: 'I am doing well, thank you!' 
        });
    });

    it('should handle API error responses', async () => {
        const mockResponse = {
            ok: false,
            json: () => Promise.resolve({
                error: { message: 'API Error' }
            })
        };
        (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        await handler(mockReq as any, mockRes as any);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'Sorry, I encountered an error. Please try again.'
        });
    });

    it('should handle network errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        await handler(mockReq as any, mockRes as any);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'Sorry, I encountered an error. Please try again.'
        });
    });
});

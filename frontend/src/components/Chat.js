import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input, Button, Box, Text, VStack, HStack, Alert, AlertIcon, Avatar, Flex, Center, Spinner } from '@chakra-ui/react';
import { FaRobot, FaPaperPlane, FaTimes, FaComment } from 'react-icons/fa';

const MAX_CHAR_LENGTH = 100;

function Chat() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState('');
    const [isMinimized, setIsMinimized] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const welcomeMessage = {
            role: 'bot',
            content: "Welcome! This chatbot is here to answer questions about Wendy. Developed with Python, Flask, GPT-4o-mini, and AWS EC2."
        };
        setChatHistory([welcomeMessage]);
    }, []);

    const sendMessage = async () => {
        if (!message) return; // Don't send empty messages
        if (message.length > MAX_CHAR_LENGTH) {
            setError(`Message cannot exceed ${MAX_CHAR_LENGTH} characters.`);
            return;
        }

        const userMessage = { role: 'user', content: message };

        setChatHistory(prevChatHistory => [...prevChatHistory, userMessage]);
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const result = await axios.post('http://localhost:5000/chat_gemini', { username, input_text: message }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const botResponse = { role: 'bot', content: result.data.response };
            setChatHistory(prevChatHistory => [...prevChatHistory, botResponse]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { role: 'bot', content: 'An error occurred. Please try again.' };
            setChatHistory(prevChatHistory => [...prevChatHistory, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChatbox = () => {
        setIsMinimized(prev => !prev);
    };

    const handleLogin = () => {
        if (!username) {
            setError('Please enter a username.');
            return;
        }
        setIsLoggedIn(true);
        setError('');
    };

    useEffect(() => {
        // Scroll to the bottom whenever chatHistory changes
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    if (isMinimized) {
        return (
           <Box
                w="4rem"
                h="4rem"
                position="fixed"
                bottom={4}
                right={4}
                bg="white"
                p={3}
                borderRadius="xl"
                boxShadow="md"
                zIndex={10}
                cursor="pointer"
                onClick={toggleChatbox}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Center>
                    <FaComment size={30} color="#ED64A6" />
                </Center>
            </Box>
        );
    }

    if (!isLoggedIn) {
        return (
            <Box
                ml={10}
                p={4}
                position="fixed"
                bottom={4}
                right={4}
                borderRadius="xl"
                boxShadow="md"
                bg="white"
                zIndex={10}
                width={{ base: '90%', sm: '80%', md: '70%', lg: '50%' }}
                maxW="630px"
            >
                <Box ml={2} display="flex" justifyContent="flex-end">
                    <HStack >
                        <FaTimes size={20} color="#CBD5E0" cursor="pointer" onClick={toggleChatbox} />
                    </HStack>
                </Box>
                <VStack spacing={4}>
                    <Input
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button onClick={handleLogin} colorScheme="teal">Enter Chat</Button>
                    {error && (
                        <Alert status="error">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}
                </VStack>
            </Box>
        );
    }

    return (
        <Box
            ml={10}
            p={4}
            position="fixed"
            bottom={4}
            right={4}
            borderRadius="xl"
            boxShadow="md"
            bg="white"
            zIndex={10}
            width={{ base: '90%', sm: '80%', md: '70%', lg: '50%' }}
            maxW="630px"
        >
            <Box ml={2} display="flex" justifyContent="flex-end">
                <HStack >
                    <FaTimes size={20} color="#CBD5E0" cursor="pointer" onClick={toggleChatbox} />
                </HStack>
            </Box>
            <Box
                mt={4}
                p={4}
                mb={1}
                borderRadius="xl"
                h="200px"
                overflowY="scroll"
                ref={chatContainerRef}
                border="1px solid #CBD5E0"
            >
                <VStack spacing={4} mt={4}>
                    {chatHistory.map((msg, index) => (
                        <HStack
                            key={index}
                            alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                            bg={msg.role === 'user' ? 'blue.100' : 'pink.100'}
                            borderRadius="md"
                            p={3}
                            maxW="70%"
                        >
                            {msg.role === 'bot' && <Avatar icon={<FaRobot />} size="sm" mr={2} />}
                            <Text>{msg.content}</Text>
                        </HStack>
                    ))}
                    {isLoading && (
                        <HStack alignSelf="flex-start" bg="pink.100" borderRadius="md" p={3} maxW="70%">
                            <Avatar icon={<FaRobot />} size="sm" mr={2} />
                            <Spinner size="sm" color="pink.500" />
                        </HStack>
                    )}
                </VStack>
            </Box>
            {error && (
                <Alert status="error" mt={2}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <Flex align="center">
                <Input
                    variant="filled"
                    placeholder="Ask something about Wendy..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={MAX_CHAR_LENGTH}
                    borderRadius="xl"
                />
                <Button
                    color="gray.100"
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    px={3}
                    py={3}
                    ml={1}
                    fontWeight="semibold"
                    rounded="full"
                    _hover={{
                        bgGradient: "linear(to-r, pink.400, purple.400)",
                    }}
                    _dark={{
                        bg: "purple.700",
                    }}
                    onClick={sendMessage}
                    isLoading={isLoading}
                >
                    <FaPaperPlane size={20} />
                </Button>
            </Flex>
        </Box>
    );
}

export default Chat;
package com.example.chatbot.web;

import com.example.chatbot.services.ChatAiService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;

@RestController
@RequestMapping("/chat")
public class ChatRestController {
    private ChatAiService chatAiService;

    public ChatRestController(ChatAiService chatAiService){
        this.chatAiService = chatAiService;
    }

    @GetMapping(value = "/ask", produces = MediaType.TEXT_PLAIN_VALUE)
    public String ask(String question){
        return chatAiService.ragChat(question);
    }
}

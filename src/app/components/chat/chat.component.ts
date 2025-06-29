import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message = '';
  messages: Array<{text: string, isUser: boolean, timestamp: Date}> = [];
  loading = false;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    // Add welcome message
    this.messages.push({
      text: 'Hello! I\'m your AI assistant. I can help you add events to your calendar. Try saying something like "add a concert event" or "add a movie night".',
      isUser: false,
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (!this.message.trim() || this.loading) {
      return;
    }

    const userMessage = this.message.trim();
    this.messages.push({
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    this.loading = true;
    this.message = '';

    // Send message to backend
    this.eventService.sendChatMessage(userMessage).subscribe({
      next: () => {
        this.messages.push({
          text: 'Great! I\'ve processed your request. The events list should be updated now. You can refresh the page to see the new events.',
          isUser: false,
          timestamp: new Date()
        });
        this.loading = false;
      },
      error: (error) => {
        this.messages.push({
          text: 'Sorry, I encountered an error while processing your request. Please try again.',
          isUser: false,
          timestamp: new Date()
        });
        this.loading = false;
        console.error('Chat error:', error);
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [{
      text: 'Hello! I\'m your AI assistant. I can help you add events to your calendar. Try saying something like "add a concert event" or "add a movie night".',
      isUser: false,
      timestamp: new Date()
    }];
  }
} 
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, Content, TextInput } from 'ionic-angular';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  editorMsg = '';
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }



  sendMsg() {
    if (!this.editorMsg.trim()) return;
    /*

    // Mock message
    const id = Date.now().toString();
    let newMsg: ChatMessage = {
        messageId: Date.now().toString(),
        userId: this.user.id,
        userName: this.user.name,
        userAvatar: this.user.avatar,
        toUserId: this.toUser.id,
        time: Date.now(),
        message: this.editorMsg,
        status: 'pending'
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    // if (!this.showEmojiPicker) {
    //     this.messageInput.setFocus();
    // }

    this.chatService.sendMsg(newMsg).then(() => {
        let index = this.getMsgIndexById(id);

        if (index !== -1) {
            this.msgList[index].status = 'success';
        }
    })*/
  }

  onFocus() {
   /*  
    //this.showEmojiPicker = false;
    */
    this.content.resize();
    this.scrollToBottom();
    
  }

  scrollToBottom() {
    setTimeout(() => {
        if (this.content.scrollToBottom) {
            this.content.scrollToBottom();
        }
    }, 400)
  }

}

import Ember from 'ember';

export default Ember.Service.extend({
  stompClient: null,
  connected: false,
  messages: null,
  username: "anonymous user",
  feedback: "",
  init() {
    this._super(...arguments);
    this.set('messages', []);
  },

  add(user, message) {
    this.get('messages').pushObject({'user': user, 'content': message});
  },
  empty() {
    this.get('messages').clear();
  },
  connect(){
    this.clearFeedback();
    var comp = this;
    var socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (/*frame*/) {
       comp.set('connected', true);
      comp.stompClient.subscribe('/topic/greetings', function (greeting) {
        var message = JSON.parse(greeting.body).content;
        var user = JSON.parse(greeting.body).user;
        comp.showMessage(user, message);
      });
    });
  },
  disconnect(){
    this.clearFeedback();
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.set('connected', false);
  },
  showMessage(user, message){
    this.add(user, message);
  },
  sendMessage(message){
    if (this.stompClient != null && this.get('connected')) {
      this.stompClient.send("/app/hello", {}, JSON.stringify({'user': this.get('username'), 'content': message}));
    }else{
      this.set('feedback', 'You are not connected!');
    }
  },
  clearFeedback(){
    this.set('feedback','');
  }
});

// ============================================================
// Question Bank — Social Steps (IRT Adaptive)
// ------------------------------------------------------------
// Each question carries IRT parameters that feed the adaptive
// question-selection engine:
//
//   difficulty (b) : item difficulty on the Rasch scale (-2..2)
//   discrimination (a) : how well the item separates ability
//     levels (1PL uses a fixed a; 2PL varies it)
//   guess (c) : pseudo-guessing parameter for 3PL (optional)
//
// The child NEVER sees difficulty labels.  The IRT engine
// automatically selects items matched to the child's ability.
// ============================================================

const questionBank = {
  greeting: [
    {
      id: 1, image: "https://images.pexels.com/photos/5278985/pexels-photo-5278985.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Leo says \"Hi!\" to Nina. What can Nina say?",
      options: ["Go away.", "\"Hi!\"", "Stop.", "Run away"],
      correct: 1, difficulty: -1.8, discrimination: 1.0, guess: 0.25,
      explanation: "We say hi back when someone greets us."
    },
    {
      id: 2, image: "https://images.pexels.com/photos/8617758/pexels-photo-8617758.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Maya waves at Sara. What can Sara do?",
      options: ["Push Maya", "Wave back", "Cry", "Take Maya's toy"],
      correct: 1, difficulty: -1.5, discrimination: 1.0, guess: 0.25,
      explanation: "Waving back is a friendly response."
    },
    {
      id: 3, image: "https://images.pexels.com/photos/8423069/pexels-photo-8423069.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Someone says \"Hello!\" to you. What can you say?",
      options: ["Go away.", "\"No!\"", "\"Hello!\"", "Nothing"],
      correct: 2, difficulty: -1.2, discrimination: 1.0, guess: 0.25,
      explanation: "Saying hello back is polite."
    },
    {
      id: 4, image: "https://images.pexels.com/photos/2675061/pexels-photo-2675061.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Aarav sees Ben at school. What can Aarav say?",
      options: ["\"Give me that.\"", "\"Hi, Ben!\"", "\"Move.\"", "\"Go away.\""],
      correct: 1, difficulty: -0.9, discrimination: 1.0, guess: 0.25,
      explanation: "Saying hi by name is a friendly greeting."
    },
    {
      id: 5, image: "https://images.pexels.com/photos/8617758/pexels-photo-8617758.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Tara smiles and says \"Hi!\" to you. What can you do?",
      options: ["Push Tara", "Shout", "Smile and say \"Hi!\"", "Walk away angrily"],
      correct: 2, difficulty: -0.6, discrimination: 1.0, guess: 0.25,
      explanation: "Smiling and greeting back matches Tara's friendliness."
    },
    {
      id: 6, image: "https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Nina meets her teacher in the morning. What can she say?",
      options: ["\"Good night!\"", "\"Go away!\"", "\"Give me that.\"", "\"Good morning!\""],
      correct: 3, difficulty: -0.3, discrimination: 1.0, guess: 0.25,
      explanation: "Good morning is the right greeting for the morning."
    },
    {
      id: 7, image: "https://images.pexels.com/photos/8423069/pexels-photo-8423069.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Alex says \"Hello!\" while you are putting away toys. What can you do?",
      options: ["Throw the toys", "Look up and say \"Hello!\"", "Shout", "Take Alex's things"],
      correct: 1, difficulty: 0.0, discrimination: 1.0, guess: 0.25,
      explanation: "Even while busy, a quick hello is polite."
    },
    {
      id: 8, q: "Maya says \"Hi!\" to Leo who is reading a book. What can Leo do?",
      options: ["Throw the book", "Shout at Maya", "Give a small wave and say \"Hi!\"", "Take Maya's things"],
      correct: 2, difficulty: 0.2, discrimination: 1.0, guess: 0.25,
      explanation: "A small wave is friendly even when busy."
    },
    {
      id: 9, q: "Sam says hello while Riya is talking to her teacher. What is good for Riya?",
      options: ["Interrupt the teacher", "Shout \"Hello!\"", "Tell Sam to leave", "Finish talking, then greet Sam"],
      correct: 3, difficulty: 0.5, discrimination: 1.0, guess: 0.25,
      explanation: "Finishing first and then greeting is respectful."
    },
    {
      id: 10, q: "You see Noah talking with someone. You want to say hello. What can you do?",
      options: ["Shout loudly", "Pull Noah away", "Smile or wave and wait", "Run between them"],
      correct: 2, difficulty: 0.7, discrimination: 1.0, guess: 0.25,
      explanation: "Waving and waiting shows you respect their conversation."
    },
    {
      id: 11, q: "You meet Ethan for the first time. Ethan smiles at you. What is friendly?",
      options: ["\"Give me your toy.\"", "\"Hi, I'm Alex. What's your name?\"", "\"Go away.\"", "\"Why are you looking at me?\""],
      correct: 1, difficulty: 0.9, discrimination: 1.0, guess: 0.25,
      explanation: "Introducing yourself is a great way to start."
    },
    {
      id: 12, q: "You say hello to Mia. She is listening to the teacher and does not answer. What can you do?",
      options: ["Keep saying \"Hello!\" loudly", "Wait until she is free", "Tap her again and again", "Get angry"],
      correct: 1, difficulty: 1.0, discrimination: 1.0, guess: 0.25,
      explanation: "Being patient shows respect when someone is busy."
    },
    {
      id: 13, q: "It is 8:00 PM and you see your neighbor. What is a good greeting?",
      options: ["\"Good morning!\"", "\"Good afternoon!\"", "\"Good evening!\"", "\"Good night!\""],
      correct: 2, difficulty: 1.1, discrimination: 1.0, guess: 0.25,
      explanation: "Good evening is the right greeting for evening time."
    },
    {
      id: 14, q: "At a birthday party, how can you start talking to a new child?",
      options: ["Ignore them completely", "\"Hi, I like your shirt. What's your name?\"", "\"Give me cake.\"", "Walk away"],
      correct: 1, difficulty: 1.2, discrimination: 1.0, guess: 0.25,
      explanation: "A compliment and question is a great conversation starter."
    },
    {
      id: 15, q: "Your friend says \"How are you?\" What is a good response?",
      options: ["Walk away", "Ignore them", "\"I'm good, thanks! How are you?\"", "\"Why do you ask?\""],
      correct: 2, difficulty: 1.4, discrimination: 1.0, guess: 0.25,
      explanation: "Answering and asking back keeps the conversation going."
    },
    {
      id: 16, q: "You want to talk to a classmate who is eating lunch. What is the best way?",
      options: ["Take their food", "Sit nearby and wait, then talk", "Shout across the room", "Pull their chair"],
      correct: 1, difficulty: 1.5, discrimination: 1.0, guess: 0.25,
      explanation: "Waiting for a natural pause is respectful."
    },
    {
      id: 17, q: "You are talking to a friend. Another friend walks up. What should you do?",
      options: ["Ignore the new friend", "Stop talking and only talk to the new friend", "Say \"Hi!\" and include them in the conversation", "Tell them to go away"],
      correct: 2, difficulty: 1.6, discrimination: 1.0, guess: 0.25,
      explanation: "Including everyone makes people feel welcome."
    },
    {
      id: 18, q: "You want to greet your friend's parent. What is a polite thing to say?",
      options: ["Ignore them", "\"Hey you!\"", "\"Hello, it's nice to meet you\"", "Walk past without saying anything"],
      correct: 2, difficulty: 1.8, discrimination: 1.0, guess: 0.25,
      explanation: "Greeting adults politely shows good manners."
    },
  ],

  sharing: [
    {
      id: 1, image: "https://images.pexels.com/photos/6966339/pexels-photo-6966339.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Your friend wants to play with your toy. What should you do?",
      options: ["Hide it", "Share it", "Refuse rudely"],
      correct: 1, difficulty: -2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Sharing toys makes friends happy."
    },
    {
      id: 2, image: "https://images.pexels.com/photos/5905458/pexels-photo-5905458.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Someone has no pencil. What can you do?",
      options: ["Keep silent", "Share yours", "Laugh"],
      correct: 1, difficulty: -1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Sharing what you have helps others."
    },
    {
      id: 3, image: "https://images.pexels.com/photos/5278985/pexels-photo-5278985.jpeg?auto=compress&cs=tinysrgb&w=400", q: "How do friends feel when you share?",
      options: ["Angry", "Happy", "Sad"],
      correct: 1, difficulty: -1.2, discrimination: 1.0, guess: 0.33,
      explanation: "Sharing makes people feel happy and cared for."
    },
    {
      id: 4, image: "https://images.pexels.com/photos/8613146/pexels-photo-8613146.jpeg?auto=compress&cs=tinysrgb&w=400", q: "You have extra snacks. What can you do?",
      options: ["Throw them", "Share with friends", "Eat alone"],
      correct: 1, difficulty: -0.8, discrimination: 1.0, guess: 0.33,
      explanation: "Sharing food is a kind thing to do."
    },
    {
      id: 5, image: "https://images.pexels.com/photos/8422173/pexels-photo-8422173.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Sharing builds what between people?",
      options: ["Fight", "Friendship", "Noise"],
      correct: 1, difficulty: -0.4, discrimination: 1.0, guess: 0.33,
      explanation: "Sharing helps build strong friendships."
    },
    {
      id: 6, image: "https://images.pexels.com/photos/5905458/pexels-photo-5905458.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Your classmate forgot their crayons. What is the kind thing to do?",
      options: ["Laugh at them", "Offer to share yours", "Tell the teacher they are bad"],
      correct: 1, difficulty: -0.1, discrimination: 1.0, guess: 0.33,
      explanation: "Offering to help shows kindness."
    },
    {
      id: 7, q: "You and a friend both want the same swing. What can you do?",
      options: ["Push them off", "Take turns", "Cry until you get it"],
      correct: 1, difficulty: 0.2, discrimination: 1.0, guess: 0.33,
      explanation: "Taking turns is fair and kind."
    },
    {
      id: 8, q: "Not sharing with others can make them feel what?",
      options: ["Happy", "Left out", "Excited"],
      correct: 1, difficulty: 0.4, discrimination: 1.0, guess: 0.33,
      explanation: "Not sharing can make others feel sad or left out."
    },
    {
      id: 9, q: "You have a big bag of chips. A friend has none. What is fair?",
      options: ["Eat them all quickly", "Give some to your friend", "Hide the bag"],
      correct: 1, difficulty: 0.6, discrimination: 1.0, guess: 0.33,
      explanation: "Fair sharing means giving some to others too."
    },
    {
      id: 10, q: "Someone forgot their lunch at school. What is a kind response?",
      options: ["Laugh", "Ignore them", "Offer to share some of yours"],
      correct: 2, difficulty: 0.8, discrimination: 1.0, guess: 0.33,
      explanation: "Offering help when someone forgets shows real kindness."
    },
    {
      id: 11, q: "You are playing a game with three friends. You finish first. What should you do?",
      options: ["Keep playing alone", "Wait for others or help them finish", "Leave without saying anything"],
      correct: 1, difficulty: 1.0, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting for or helping others is cooperative."
    },
    {
      id: 12, q: "Your friend shares their snack with you. Later you have cookies. What should you do?",
      options: ["Eat them all yourself", "Offer some back to your friend", "Throw them away"],
      correct: 1, difficulty: 1.1, discrimination: 1.0, guess: 0.33,
      explanation: "Reciprocating kindness strengthens friendships."
    },
    {
      id: 13, q: "Two friends both want the same book at the library. What is fair?",
      options: ["Grab it first", "Fight for it", "Decide together who reads it first"],
      correct: 2, difficulty: 1.3, discrimination: 1.0, guess: 0.33,
      explanation: "Talking it through and deciding together is fair."
    },
    {
      id: 14, q: "You finish building blocks. Another child wants to use them. What should you do?",
      options: ["Knock them down so no one can use them", "Let them build too, or help them", "Say \"No, they are mine\""],
      correct: 1, difficulty: 1.4, discrimination: 1.0, guess: 0.33,
      explanation: "Letting others use materials shows good sharing."
    },
    {
      id: 15, q: "In a group project, one person does all the work. What should the group do?",
      options: ["Let one person do everything", "Share the tasks so everyone helps", "Not do the project"],
      correct: 1, difficulty: 1.5, discrimination: 1.0, guess: 0.33,
      explanation: "Sharing work fairly helps everyone learn."
    },
    {
      id: 16, q: "Your friend is sad because they lost their toy. What is the kindest thing?",
      options: ["Say \"Not my problem\"", "Let them play with one of yours", "Laugh"],
      correct: 1, difficulty: 1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Offering your own things shows real empathy."
    },
    {
      id: 17, q: "You have two cookies and your friend has none. But you are very hungry. What is kind?",
      options: ["Eat both and say nothing", "Eat one and give one to your friend", "Throw one away"],
      correct: 1, difficulty: 1.8, discrimination: 1.0, guess: 0.33,
      explanation: "Sharing even when it is hard shows true kindness."
    },
    {
      id: 18, q: "A new student joins your class and has no one to sit with. What should you do?",
      options: ["Ignore them", "Invite them to sit with you and share your supplies", "Tell them to sit somewhere else"],
      correct: 1, difficulty: 2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Welcoming and sharing with a new student is very kind."
    },
  ],

  waiting: [
    {
      id: 1, image: "https://images.pexels.com/photos/7092351/pexels-photo-7092351.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Someone is talking to you. What should you do?",
      options: ["Interrupt", "Wait", "Shout"],
      correct: 1, difficulty: -2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting while someone talks shows respect."
    },
    {
      id: 2, image: "https://images.pexels.com/photos/8617987/pexels-photo-8617987.jpeg?auto=compress&cs=tinysrgb&w=400", q: "You are in a line at the store. What should you do?",
      options: ["Push ahead", "Wait", "Leave"],
      correct: 1, difficulty: -1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting in line is the right thing to do."
    },
    {
      id: 3, image: "https://images.pexels.com/photos/8500643/pexels-photo-8500643.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Waiting shows that you are...",
      options: ["Angry", "Patient", "Noisy"],
      correct: 1, difficulty: -1.2, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting shows patience."
    },
    {
      id: 4, image: "https://images.pexels.com/photos/8419196/pexels-photo-8419196.jpeg?auto=compress&cs=tinysrgb&w=400", q: "You are at a restaurant and food is coming. What should you do?",
      options: ["Yell at the server", "Wait calmly", "Run to the kitchen"],
      correct: 1, difficulty: -0.8, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting calmly at a restaurant is polite."
    },
    {
      id: 5, image: "https://images.pexels.com/photos/8197534/pexels-photo-8197534.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Your friend is on the slide. You want a turn. What should you do?",
      options: ["Push them off", "Shout at them", "Wait for your turn"],
      correct: 2, difficulty: -0.5, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting for your turn is fair and safe."
    },
    {
      id: 6, image: "https://images.pexels.com/photos/7092351/pexels-photo-7092351.jpeg?auto=compress&cs=tinysrgb&w=400", q: "The teacher is talking. You have a question. What should you do?",
      options: ["Shout out your question", "Raise your hand and wait", "Walk out"],
      correct: 1, difficulty: -0.2, discrimination: 1.0, guess: 0.33,
      explanation: "Raising your hand and waiting is the right way."
    },
    {
      id: 7, q: "You are waiting in line and someone cuts in front. What can you do?",
      options: ["Push them back", "Tell them politely to go to the end", "Shout at them"],
      correct: 1, difficulty: 0.1, discrimination: 1.0, guess: 0.33,
      explanation: "Politely asking is better than pushing or shouting."
    },
    {
      id: 8, q: "Waiting in a line is about...",
      options: ["Chaos", "Noise", "Fairness"],
      correct: 2, difficulty: 0.3, discrimination: 1.0, guess: 0.33,
      explanation: "Lines help everyone get a fair turn."
    },
    {
      id: 9, q: "Your turn for a game is coming. You feel excited. What can you do while waiting?",
      options: ["Yell and run around", "Take deep breaths and wait calmly", "Leave the line"],
      correct: 1, difficulty: 0.5, discrimination: 1.0, guess: 0.33,
      explanation: "Deep breaths help you stay calm while waiting."
    },
    {
      id: 10, q: "The teacher is busy helping another student. What should you do?",
      options: ["Interrupt loudly", "Wait patiently", "Walk away"],
      correct: 1, difficulty: 0.7, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting patiently is respectful of the teacher's time."
    },
    {
      id: 11, q: "You are at a bus stop. The bus is late. What can you do?",
      options: ["Run into the road", "Wait safely and look at a book", "Scream"],
      correct: 1, difficulty: 0.9, discrimination: 1.0, guess: 0.33,
      explanation: "Doing a calm activity while waiting helps time pass."
    },
    {
      id: 12, q: "Your friend is telling a story. You want to talk. What should you do?",
      options: ["Interrupt right away", "Listen and wait for a pause", "Cover your ears"],
      correct: 1, difficulty: 1.0, discrimination: 1.0, guess: 0.33,
      explanation: "Listening and waiting for a pause is polite."
    },
    {
      id: 13, q: "You want to use the bathroom but someone is inside. What should you do?",
      options: ["Bang on the door", "Wait outside quietly", "Go somewhere else"],
      correct: 1, difficulty: 1.2, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting quietly is the respectful choice."
    },
    {
      id: 14, q: "It is your turn to get water, but another child looks very thirsty. What can you do?",
      options: ["Go first anyway", "Let them go first", "Push them away"],
      correct: 1, difficulty: 1.4, discrimination: 1.0, guess: 0.33,
      explanation: "Letting someone who needs it more go first is kind."
    },
    {
      id: 15, q: "You are playing a board game and it is not your turn. You feel bored. What can you do?",
      options: ["Move your piece anyway", "Watch and wait, or cheer for others", "Quit the game"],
      correct: 1, difficulty: 1.5, discrimination: 1.0, guess: 0.33,
      explanation: "Watching others and cheering keeps the game fun."
    },
    {
      id: 16, q: "Waiting helps you learn to control your...",
      options: ["Anger", "Food", "Toys"],
      correct: 0, difficulty: 1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Waiting teaches self-control, which is an important skill."
    },
    {
      id: 17, q: "You see a friend finish a puzzle before you. You are still working on yours. What can you think?",
      options: ["\"This is not fair!\"", "\"Everyone works at their own pace and that's okay\"", "\"I should give up\""],
      correct: 1, difficulty: 1.8, discrimination: 1.0, guess: 0.33,
      explanation: "Understanding that people work at different speeds is mature."
    },
    {
      id: 18, q: "You are waiting a long time for your parent after school. You feel tired. What is the best thing?",
      options: ["Run out of the school", "Sit safely and do a calm activity while you wait", "Yell loudly"],
      correct: 1, difficulty: 2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Doing something calm helps you feel better while waiting."
    },
  ],

  emotion: [
    {
      id: 1, image: "https://images.pexels.com/photos/256657/pexels-photo-256657.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Your friend is crying. What can you do?",
      options: ["Ignore", "Help them", "Laugh"],
      correct: 1, difficulty: -2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Helping someone who is crying is kind."
    },
    {
      id: 2, image: "https://images.pexels.com/photos/5278985/pexels-photo-5278985.jpeg?auto=compress&cs=tinysrgb&w=400", q: "A happy face usually means someone is...",
      options: ["Crying", "Angry", "Smiling"],
      correct: 2, difficulty: -1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Happy people usually smile."
    },
    {
      id: 3, image: "https://images.pexels.com/photos/256657/pexels-photo-256657.jpeg?auto=compress&cs=tinysrgb&w=400", q: "When someone feels sad, they might...",
      options: ["Laugh", "Run", "Cry"],
      correct: 2, difficulty: -1.2, discrimination: 1.0, guess: 0.33,
      explanation: "Crying is a common sign of sadness."
    },
    {
      id: 4, image: "https://images.pexels.com/photos/7929377/pexels-photo-7929377.jpeg?auto=compress&cs=tinysrgb&w=400", q: "An angry face often looks like someone is...",
      options: ["Happy", "Mad", "Calm"],
      correct: 1, difficulty: -0.8, discrimination: 1.0, guess: 0.33,
      explanation: "An angry face shows that someone is mad."
    },
    {
      id: 5, image: "https://images.pexels.com/photos/5278985/pexels-photo-5278985.jpeg?auto=compress&cs=tinysrgb&w=400", q: "An emotion is a...",
      options: ["Object", "Feeling", "Food"],
      correct: 1, difficulty: -0.5, discrimination: 1.0, guess: 0.33,
      explanation: "Emotions are feelings we have inside."
    },
    {
      id: 6, image: "/images/scenarios/emotion-06.svg", q: "You feel scared during a thunderstorm. What can you do?",
      options: ["Stay calm and talk to someone you trust", "Run outside", "Shout at the sky"],
      correct: 0, difficulty: -0.2, discrimination: 1.0, guess: 0.33,
      explanation: "Staying calm and talking to someone helps when scared."
    },
    {
      id: 7, q: "When you feel very angry, what is a good thing to do?",
      options: ["Hit someone", "Take deep breaths and stay calm", "Shout at everyone"],
      correct: 1, difficulty: 0.1, discrimination: 1.0, guess: 0.33,
      explanation: "Deep breaths help calm anger."
    },
    {
      id: 8, q: "Your friend opens a present and looks shocked. What emotion might they feel?",
      options: ["Sleepy", "Surprised", "Bored"],
      correct: 1, difficulty: 0.3, discrimination: 1.0, guess: 0.33,
      explanation: "Shock and surprise go together."
    },
    {
      id: 9, q: "You see your friend smiling big at a birthday party. How do they probably feel?",
      options: ["Sad", "Joyful", "Scared"],
      correct: 1, difficulty: 0.5, discrimination: 1.0, guess: 0.33,
      explanation: "Big smiles at a party show joy."
    },
    {
      id: 10, q: "Your friend looks sad. What is a kind thing to do?",
      options: ["Tease them", "Talk to them and ask what is wrong", "Ignore them"],
      correct: 1, difficulty: 0.7, discrimination: 1.0, guess: 0.33,
      explanation: "Asking someone what is wrong shows you care."
    },
    {
      id: 11, q: "Empathy means...",
      options: ["Ignoring feelings", "Understanding how someone else feels", "Shouting"],
      correct: 1, difficulty: 0.9, discrimination: 1.0, guess: 0.33,
      explanation: "Empathy is understanding other people's feelings."
    },
    {
      id: 12, q: "Your classmate falls down and hurts their knee. They look upset. What can you do?",
      options: ["Laugh at them", "Go tell a teacher and check if they are okay", "Walk away"],
      correct: 1, difficulty: 1.1, discrimination: 1.0, guess: 0.33,
      explanation: "Getting help and checking on someone is caring."
    },
    {
      id: 13, q: "Your friend is angry because they lost a game. What can you say?",
      options: ["\"You are bad at this\"", "\"It's okay, you can try again next time\"", "\"I'm glad I won\""],
      correct: 1, difficulty: 1.2, discrimination: 1.0, guess: 0.33,
      explanation: "Being encouraging helps a friend who is upset."
    },
    {
      id: 14, q: "Your friend looks worried before a test. What can you do?",
      options: ["Tell them they will fail", "Say \"You studied hard, you'll do great!\"", "Ignore them"],
      correct: 1, difficulty: 1.4, discrimination: 1.0, guess: 0.33,
      explanation: "Encouraging words help reduce worry."
    },
    {
      id: 15, q: "You accidentally break your friend's crayon. They look upset. What should you do?",
      options: ["Blame someone else", "Apologize and offer to share yours", "Run away"],
      correct: 1, difficulty: 1.5, discrimination: 1.0, guess: 0.33,
      explanation: "Apologizing and making it right shows empathy."
    },
    {
      id: 16, q: "Managing your feelings so they do not hurt others is called...",
      options: ["Emotional control", "Fighting", "Ignoring everything"],
      correct: 0, difficulty: 1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Emotional control helps you manage feelings safely."
    },
    {
      id: 17, q: "Your friend is very excited about a trip. You feel a little jealous. What can you think?",
      options: ["\"I should be angry at them\"", "\"It's okay to feel jealous, and I can be happy for them too\"", "\"They should not go\""],
      correct: 1, difficulty: 1.8, discrimination: 1.0, guess: 0.33,
      explanation: "It's okay to have mixed feelings and still be kind."
    },
    {
      id: 18, q: "You see someone crying alone at recess. What is the most thoughtful thing to do?",
      options: ["Tell other kids to laugh at them", "Sit nearby and gently ask if they want to talk", "Ignore them completely"],
      correct: 1, difficulty: 2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Approaching gently shows real empathy and courage."
    },
  ],

  communication: [
    {
      id: 1, image: "https://images.pexels.com/photos/5905458/pexels-photo-5905458.jpeg?auto=compress&cs=tinysrgb&w=400", q: "You need help from a teacher. What should you say?",
      options: ["Demand loudly", "\"Please, can you help me?\"", "Stay silent"],
      correct: 1, difficulty: -2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Saying please is polite when asking for help."
    },
    {
      id: 2, image: "https://images.pexels.com/photos/8617758/pexels-photo-8617758.jpeg?auto=compress&cs=tinysrgb&w=400", q: "We communicate with other people by...",
      options: ["Talking", "Objects", "Food"],
      correct: 0, difficulty: -1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Talking is one way we communicate."
    },
    {
      id: 3, image: "https://images.pexels.com/photos/5278985/pexels-photo-5278985.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Which word is polite to use?",
      options: ["Please", "Shout", "Hit"],
      correct: 0, difficulty: -1.2, discrimination: 1.0, guess: 0.33,
      explanation: "Please is a polite word."
    },
    {
      id: 4, image: "https://images.pexels.com/photos/8197534/pexels-photo-8197534.jpeg?auto=compress&cs=tinysrgb&w=400", q: "We listen with our...",
      options: ["Hands", "Ears", "Eyes"],
      correct: 1, difficulty: -0.8, discrimination: 1.0, guess: 0.33,
      explanation: "We use our ears to listen."
    },
    {
      id: 5, image: "https://images.pexels.com/photos/8423069/pexels-photo-8423069.jpeg?auto=compress&cs=tinysrgb&w=400", q: "Good communication means...",
      options: ["Shouting", "Clear and kind talking", "Fighting"],
      correct: 1, difficulty: -0.5, discrimination: 1.0, guess: 0.33,
      explanation: "Good communication is clear and kind."
    },
    {
      id: 6, image: "https://images.pexels.com/photos/5905458/pexels-photo-5905458.jpeg?auto=compress&cs=tinysrgb&w=400", q: "You bump into someone by accident. What should you say?",
      options: ["Ignore them", "\"Sorry! Are you okay?\"", "Blame them"],
      correct: 1, difficulty: -0.2, discrimination: 1.0, guess: 0.33,
      explanation: "Apologizing when you make a mistake is polite."
    },
    {
      id: 7, q: "When someone is talking to you, you should...",
      options: ["Look at your phone", "Listen carefully", "Walk away"],
      correct: 1, difficulty: 0.1, discrimination: 1.0, guess: 0.33,
      explanation: "Listening carefully shows respect."
    },
    {
      id: 8, q: "Communication includes...",
      options: ["Only sleeping", "Only shouting", "Speaking and listening"],
      correct: 2, difficulty: 0.3, discrimination: 1.0, guess: 0.33,
      explanation: "Communication involves both speaking and listening."
    },
    {
      id: 9, q: "Using a calm voice when you are upset shows...",
      options: ["Good communication", "Rudeness", "Weakness"],
      correct: 0, difficulty: 0.5, discrimination: 1.0, guess: 0.33,
      explanation: "A calm voice helps people understand you better."
    },
    {
      id: 10, q: "You disagree with a friend about a game rule. What can you do?",
      options: ["Yell at them", "Talk calmly and listen to their idea", "Leave without saying anything"],
      correct: 1, difficulty: 0.7, discrimination: 1.0, guess: 0.33,
      explanation: "Talking calmly helps solve disagreements."
    },
    {
      id: 11, q: "Your friend tells you something important. What does active listening look like?",
      options: ["Look at them, nod, and respond", "Look away and think about something else", "Interrupt them"],
      correct: 0, difficulty: 0.9, discrimination: 1.0, guess: 0.33,
      explanation: "Active listening means giving your full attention."
    },
    {
      id: 12, q: "You want to join a group playing a game. What can you say?",
      options: ["Push in and start playing", "\"Can I play with you?\"", "\"This game is stupid\""],
      correct: 1, difficulty: 1.0, discrimination: 1.0, guess: 0.33,
      explanation: "Asking politely to join is respectful."
    },
    {
      id: 13, q: "Someone does not understand what you said. What can you do?",
      options: ["Get angry", "Try explaining it in a different way", "Walk away"],
      correct: 1, difficulty: 1.2, discrimination: 1.0, guess: 0.33,
      explanation: "Rephrasing helps the other person understand."
    },
    {
      id: 14, q: "Your friend shares a drawing with you. What is a kind response?",
      options: ["\"It's bad\"", "\"I like how you used those colors!\"", "Walk away"],
      correct: 1, difficulty: 1.3, discrimination: 1.0, guess: 0.33,
      explanation: "Giving a specific compliment is encouraging."
    },
    {
      id: 15, q: "You accidentally said something hurtful to your friend. What should you do?",
      options: ["Pretend it did not happen", "Apologize sincerely and say you did not mean it", "Blame them"],
      correct: 1, difficulty: 1.5, discrimination: 1.0, guess: 0.33,
      explanation: "A sincere apology helps repair the friendship."
    },
    {
      id: 16, q: "A classmate is talking but you notice another student looks left out. What can you do?",
      options: ["Ignore the left-out student", "Include them in the conversation", "Tell them to leave"],
      correct: 1, difficulty: 1.6, discrimination: 1.0, guess: 0.33,
      explanation: "Including everyone makes communication kind."
    },
    {
      id: 17, q: "You need to tell your teacher you will be absent tomorrow. What is the best way?",
      options: ["Tell no one", "Tell the teacher politely ahead of time", "Shout it across the room"],
      correct: 1, difficulty: 1.8, discrimination: 1.0, guess: 0.33,
      explanation: "Telling the teacher ahead of time shows responsibility."
    },
    {
      id: 18, q: "You want to disagree with an adult respectfully. What can you say?",
      options: ["Scream at them", "\"I understand, but may I share my thought?\"", "Ignore them completely"],
      correct: 1, difficulty: 2.0, discrimination: 1.0, guess: 0.33,
      explanation: "Respectful disagreement shows maturity and good communication."
    },
  ],
};

// ============================================================
// Scenario illustrations
// ------------------------------------------------------------
// Each Easy item above carries its own `image` field, written inline
// on the question object exactly like the rest of its data - nothing
// is computed here. Medium and Hard items have no `image` key at all,
// so the page renders them as plain text. Two reasons:
//
//   1. The scaffolding should fade as the skill grows. A child
//      who answers the easy items correctly is moved to harder
//      items, where the picture is gone - so support is
//      withdrawn exactly when it stops being needed.
//   2. The harder items are the ones that require inferring
//      intent or mental state. A picture there would mostly
//      restate the question and hand over the answer.
//
// Most illustrations are Pexels photo URLs, so they need an internet
// connection. emotion-06 is the one exception: the reference set has
// no photo of a scared child, so it uses a locally drawn SVG kept at
// frontend/images/scenarios/emotion-06.svg (served from
// /images/scenarios/... by the express.static mount in server.js).
const IMAGE_DIFFICULTY_MAX = 0;

const scenarioWarnings = [];

// Safety net: an Easy item may carry an image, nothing above it may.
// This only reports and strips - it never adds one.
for (const [module, items] of Object.entries(questionBank)) {
  for (const item of items) {
    if (item.image && item.difficulty > IMAGE_DIFFICULTY_MAX) {
      scenarioWarnings.push(`${module}:${item.id} image removed (b=${item.difficulty})`);
      delete item.image;
    }
  }
}

if (scenarioWarnings.length) {
  console.warn(`[questions] scenario art:\n  ${scenarioWarnings.join('\n  ')}`);
}

export default questionBank;
export { IMAGE_DIFFICULTY_MAX };

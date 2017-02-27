export let POSTS = [
  {
    id: 0,
    user_id: 2,
    name: 'Ben Sparrow',
    content: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot...',
    image: 'assets/img/thumb/img_1.jpg',
    face: 'assets/img/user/ben.png',
    time: 'Thursday 05:57 PM',
    liked: false,
    likeCount: 2,
    commentCount: 5,
    comments: [
      {
        id: 0,
        user_id: 2,
        name: 'Max Lynx',
        face: 'assets/img/user/max.png',
        liked: false,
        likeCount: 2,
        time: '2 hours ago',
        content: 'A wonderful serenity has taken possession'
      },
      {
        id: 1,
        user_id: 2,
        name: 'Adam Bradleyson',
        face: 'assets/img/user/adam.jpg',
        liked: true,
        likeCount: 1,
        time: '2 hours ago',
        content: 'I should buy a boat'
      },
      {
        id: 2,
        user_id: 2,
        name: 'Perry Governor',
        face: 'assets/img/user/perry.png',
        liked: true,
        likeCount: 3,
        time: '2 hours ago',
        content: 'Look at my mukluks!'
      },
      {
        id: 3,
        user_id: 2,
        name: 'Ben Sparrow',
        face: 'assets/img/user/ben.png',
        liked: true,
        likeCount: 1,
        time: '2 hours ago',
        content: 'You on your way?'
      }
    ]
  },
  {
    id: 1,
    user_id: 2,
    name: 'Max Lynx',
    content: 'Look at Messi\'s skills',
    image: 'assets/img/thumb/img_2.jpg',
    face: 'assets/img/user/max.png',
    time: 'Thursday 05:59 PM',
    liked: true,
    likeCount: 2,
    commentCount: 7,
    comments: []
  },
  {
    id: 2,
    user_id: 2,
    name: 'Adam Bradleyson',
    content: 'Far far away, behind the word mountains.',
    image: 'assets/img/thumb/img_3.jpg',
    face: 'assets/img/user/adam.jpg',
    time: 'Thursday 06:06 PM',
    liked: false,
    likeCount: 2,
    commentCount: 2,
    comments: []
  },
  {
    id: 3,
    user_id: 2,
    name: 'Perry Governor',
    content: 'There live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.',
    image: 'assets/img/thumb/img_4.jpg',
    face: 'assets/img/user/perry.png',
    time: 'Thursday 06:50 PM',
    liked: false,
    likeCount: 2,
    commentCount: 7,
    comments: []
  }
]

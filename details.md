**Below Lies a sample message req.body object**


```json
{
  update_id: 44275514,
  message: {
    message_id: 22,
    from: { // A mongodb database -> message.from.id
      id: 'userID', // This is a number, representing an ID. 
      is_bot: false,
      first_name: 'Jalla',
      username: 'Tgame23',
      language_code: 'en'
    },
    chat: {
      id: chatID, // This is a number, representing an ID.
      first_name: 'Jalla',
      username: 'Tgame23',
      type: 'private'
    },
    date: 1751389541,
    text: 'Code'
  }
}
```
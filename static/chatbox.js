
export class ChatBox {
	constructor(text_area)
	{
		this.text_area = text_area;
		this.position = 0;
	}
	add_chat_messages(messages)
	{
		msgs = messages.messages;
		for (var i = 0; i < msgs.length; i++)
		{
			this.add_chat_message(msgs[i]);
		}
	}
	add_chat_message(message)
	{
		this.chat_position = message.position;
		let elem = document.createElement("p");
		elem.appendChild(document.createTextNode(message.payload));
		this.text_area.appendChild(elem);
	}
}


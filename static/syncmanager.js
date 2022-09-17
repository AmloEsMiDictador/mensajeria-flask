
export var SyncStatus = {
	ok: 1,
	nochange: 2
}

export class SyncManager {
	constructor(chatbox, chat_id)
	{
		this.chatbox = chatbox;
		this.chat_id = chat_id;
		this.pending_outbound = []
		this._outbound = [];
		this._timer_reset();
	}
	add_outbound_message(message)
	{
		this.pending_outbound.push(message);
		this._timer_reset();
	}
	do_sync()
	{
		if (this.pending_outbound && this._outbound === undefined)
			return this._send_outbound();
		else
			return this._recv_new_messages();
	}
	_recv_new_messages()
	{
		return fetch("/api/web/get_msgs" +
			"?chat_id=" + this.chat_id +
			"&position=" + this.chatbox.position +
			"&max_messages=40")
		.then(response => {
			if (!response.ok)
				throw new Error("Servidor regresó un error");
			return response;
		})
		.then(response => response.json())
		.then(json => {
			if (json.messages.length == 0)
			{
				return SyncStatus.ok | SyncStatus.nochange;
			}
			else
			{
				this.chatbox.add_messages(json.messages);
				return SyncStatus.ok;
			}
		})
		.catch(error => console.error("Error al recivir los mensajes:", error));
	}
	_send_outbound()
	{
		datos = Object();
		datos.chat_id = this.chat_id;
		datos.messages = this.pending_outbound;
		this._outbound = datos.messages;

		return fetch("/api/web/post_msgs", {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(datos)
		})
		.then(response => {
			console.log("D:", this);
			if (!response.ok)
				throw new Error("Servidor regresó un error");
			this.pending_outbound = this.pending_outbound.filter(e => !this._outbound.includes(e));
			this._outbound = undefined;
			console.log("D:", this);
			return SyncStatus.ok;
		})
		.catch(error => {
			console.error("Error al enviar el mensaje", error);
			this._outbound = undefined;
		});
	}
}


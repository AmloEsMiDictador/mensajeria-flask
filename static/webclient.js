
chat_id = 1;
chat_position = 0;

function setup()
{
	text_input = document.getElementById("text_input");
	message_area = document.getElementById("message_area");

	text_input.addEventListener("keyup", event => {
		if (event.key !== "Enter")
			return;
		enviar();
	});
}

window.onload = setup;



$(function () {
  $("body").on("submit", ".assistant", function (event) {
    event.preventDefault();
    let current_form = $(this);
    let submit = current_form.find('[type="submit"]');

    if (submit.val() === "Thinking...") {
      return;
    }
    let textarea = $("#prompt");

    submit.html("Thinking...");
    const promptText = textarea.val();
    textarea.val("");
    $(".ai_result").append(
      `<article data-role='user' class='chat_message'>${promptText}</article>`
    );

    let messages = [];

    $(".chat_message").each(function () {
      messages.push({
        role: $(this).attr("data-role"),
        content: $(this).text(),
      });
    });

    fetch("https://www.app.anchortrends.com/API_gptChat/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messages }),
    })
      .then((response) => response.json())
      .then((data) => {
        try {
          submit.html("Query");
          let text = (
            data["choices"] === undefined
              ? data["error"] === undefined
                ? data
                : data["error"]["message"]
              : data["choices"][0]["message"]["content"]
          ).replaceAll("\n", "<br>");

          $(".ai_result").append(
            `<article data-role='assistant' class='chat_message'>${text}</article>`
          );
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    return false;
  });
});

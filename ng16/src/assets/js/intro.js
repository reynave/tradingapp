const quote = [
    ["- Nicolas Darvas -", "I believe in analysis and not forecasting"],
    ["", "It’s not about better time management. It’s about better life management"],
    ["- Victor Sperandeo -", "The key to trading success is emotional discipline. If intelligence were the key, there would be a lot more people making money trading."],
    ["- Alexander Elder -", "The goal of a successful trader is to make the best trades. Money is secondary."],
    ["- Warren Buffett -", "Risk comes from not knowing what you're doing."],
    ["- Alfred The Batman Begin -", "Why Do We Fall, Bruce? So We Can Learn To Pick Ourselves Up."],
    ["- Jim Simons -", "The best decisions are often made with data and evidence, not just gut feelings."],
    ["- Jim Simons -", "Success in investing is not about being right all the time. It’s about minimizing losses and maximizing gains."],
    ["- Jim Simons -", "It’s important to surround yourself with smart and talented people. Collaboration and diverse perspectives lead to better outcomes."],
    ["", "Don’t blindly follow someone, believe in data and analysis "],

];
let date = new Date();
let id = date.getDay() + 1;
document.getElementById("quoteId").innerHTML = quote[id][1];
document.getElementById("authorId").innerHTML = quote[id][0];

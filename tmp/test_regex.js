const line = "31/05/2025, 8:44 pm - Owner: Adv. Dhanashree Vaibhav Swami";
// Using \s instead of literal space to handle Narrow No-Break Space
const regex = /^\[?(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\]?\s*(?:-\s+)?([^:]+):\s*(.*)$/i;

const match = line.match(regex);
if (match) {
    console.log("Match found!");
    console.log("Timestamp:", match[1]);
    console.log("Name:", match[2]);
    console.log("Message:", match[3]);
} else {
    console.log("No match found.");
}

const line2 = "31/05/2025, 8:44 pm - Yuna: Ok";
const match2 = line2.match(regex);
console.log("\nLine 2:");
if (match2) {
    console.log("Match found!");
    console.log("Timestamp:", match2[1]);
    console.log("Name:", match2[2]);
    console.log("Message:", match2[3]);
} else {
    console.log("No match found.");
}

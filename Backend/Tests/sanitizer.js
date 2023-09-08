const Sanitizer = require("../Sanitizer");

const testCases = [
  { input: "<script>alert('Malicious script');</script>", type: "HTML Attack" }, // Contains HTML tags
  { input: "<script>", type: "HTML Attack" }, // Contains HTML tags
  { input: "user@example.com", type: "Email" }, // Valid email
  { input: "12345", type: "Integer" }, // Valid integer
  { input: "3.14", type: "Float" }, // Valid float
  { input: "invalid.email.com", type: "Email" }, // Invalid email
  { input: "123abc", type: "Integer" }, // Contains non-digit characters
  { input: "2.5.7", type: "Float" }, // Contains multiple decimal points
  { input: " ", type: "Empty String" }, // Empty string
  { input: "42", type: "Float" }, // Integer passed to float parser
];

for (const testCase of testCases) {
  try {
    const sanitizer = new Sanitizer(testCase.input);
    switch (testCase.type) {
      case "HTML Attack":
        sanitizer.sanitize();
        break;
      case "Email":
        sanitizer.validateEmail();
        break;
      case "Integer":
        sanitizer.validateInt();
        break;
      case "Float":
        sanitizer.validateFloat();
        break;
      default:
        console.log(`Invalid test type: ${testCase.type}`);
        continue;
    }
    console.log(`Input: "${testCase.input}"`);
    console.log(`Test Type: ${testCase.type}`);
    console.log(`Is Valid: ${sanitizer.isValid()}`);
    console.log(`Problems: ${sanitizer.checkErrors()}`);
    console.log("------------------------");
  } catch (e) {
    console.error("Error caught", e);
  }
}

import student from "./student.json" assert { type: "json" }
import gpt from "./gpt.json" assert { type: "json" }

const sortedStudent = [...student].sort((a, b) => a.probability - b.probability)
const sortedGpt = [...gpt].sort((a, b) => a.probability - b.probability)

let csv = "percentile,student,gpt"

for (let i = 0; i < 100; i++) {
    csv += `\n${i},${sortedStudent[Math.floor(i / 100 * sortedStudent.length)].probability},${sortedGpt[Math.floor(i / 100 * sortedGpt.length)].probability}`
}

console.log(csv)

Deno.writeTextFileSync("data.csv", csv)
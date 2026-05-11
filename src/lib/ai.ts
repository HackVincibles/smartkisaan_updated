import axios from "axios";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const BASE_URL = "https://api-inference.huggingface.co/models/";

export class AIService {
  private headers = { Authorization: `Bearer ${HF_API_KEY}` };

  async detectCrop(imageUrl: string): Promise<string> {
    const model = "microsoft/resnet-50";
    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const res = await axios.post(`${BASE_URL}${model}`, response.data, { headers: this.headers });
      return res.data[0]?.label || "unknown";
    } catch (error) {
      console.error("AI Detect Crop Error:", error);
      return "unknown";
    }
  }

  async gradeQuality(imageUrl: string, crop: string): Promise<{ grade: string; score: number }> {
    const model = "dandelin/vilt-b32-finetuned-vqa";
    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const payload = {
        inputs: {
          image: Buffer.from(response.data).toString("base64"),
          question: `What is the quality of this ${crop}? (Options: High, Medium, Low)`
        }
      };
      const res = await axios.post(`${BASE_URL}${model}`, payload, { headers: this.headers });
      
      const answer = res.data[0]?.answer?.toLowerCase() || "";
      if (answer.includes("high")) return { grade: "A", score: 0.92 };
      if (answer.includes("medium")) return { grade: "B", score: 0.75 };
      return { grade: "C", score: 0.55 };
    } catch (error) {
      return { grade: "B", score: 0.75 };
    }
  }

  async estimateShelfLife(crop: string, grade: string): Promise<number> {
    const baseDays: Record<string, number> = { tomato: 7, potato: 60, onion: 90, apple: 14 };
    const days = baseDays[crop.toLowerCase()] || 5;
    if (grade === "A") return days;
    if (grade === "B") return Math.floor(days * 0.7);
    return Math.floor(days * 0.4);
  }
}

export const aiService = new AIService();

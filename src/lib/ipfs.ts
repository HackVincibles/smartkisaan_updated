import axios from "axios";
import FormData from "form-data";

const PINATA_JWT = process.env.PINATA_JWT;

export class IPFSService {
  async uploadFromUrl(imageUrl: string, fileName: string): Promise<string> {
    try {
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const formData = new FormData();
      formData.append("file", Buffer.from(response.data), { filename: fileName });

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      });

      return res.data.IpfsHash;
    } catch (error) {
      console.error("IPFS Upload Error:", error);
      return "";
    }
  }
}

export const ipfsService = new IPFSService();

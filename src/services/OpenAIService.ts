import { Injectable } from '@nestjs/common';
import OpenAIApi from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  
  private openai: OpenAIApi;

  constructor(configService: ConfigService) {
    this.openai = new OpenAIApi({
      apiKey:configService.get<string>('api_key'),
    });
  }

  async analyzeImage(url: string): Promise<{ accidentDetected: boolean; classification: string; licensePlate: string }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages:[
          {
            "role": "user",
            "content": [
              {"type": "text", "text": "Analyze the image and determine if there is an accident. If an accident is detected, classify the accident and extract the license plate number if visible."},
              {
                "type": "image_url",
                "image_url": {
                  "url": url,
                },
              },
            ],
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            strict: true,
            schema: {
              type: "object",
              properties: {
                accidentDetected: {
                  type: "boolean",
                  description: "Indicates whether an accident was detected in the image (true/false)"
                },
                classification: {
                  type: "string",
                  description: "Provides a description or type of accident detected in Spanish (e.g., colisión menor, choque mayor)"
                },
                licensePlate: {
                  type: "string",
                  description: "Extracts the license plate number from the image if visible"
                }
              },
              required: ["accidentDetected", "classification", "licensePlate"],
              additionalProperties: false
            },
            name: "AccidentDetectionSchema",
            description: "Schema for analyzing an image to determine if an accident occurred, classify it, and extract the license plate number if available."
          }
        },
        max_tokens: 300,
      });
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      throw new Error('Error analyzing image with OpenAI '+error.message);
    }
  }
}

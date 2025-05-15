/**
 * FAL AI API Client
 *
 * This module provides functions for interacting with the FAL AI API.
 */

import { fal } from "@fal-ai/client";

// Initialize the FAL client with the API key from environment variables
const initializeFalClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_FAL_KEY || localStorage.getItem("fal_api_key");

  if (apiKey) {
    fal.config({
      credentials: apiKey,
    });
    return true;
  }

  return false;
};

/**
 * Generate an image using FAL AI Flux with Lora
 * @param {Object} params - Image generation parameters
 * @param {string} params.prompt - The prompt to generate an image from
 * @param {string} params.image_size - The size of the generated image
 * @param {number} params.num_inference_steps - The number of inference steps
 * @param {number} params.seed - The seed for reproducibility
 * @param {number} params.guidance_scale - The guidance scale
 * @param {number} params.num_images - The number of images to generate
 * @param {boolean} params.enable_safety_checker - Whether to enable the safety checker
 * @param {string} params.output_format - The output format (jpeg or png)
 * @param {Array} params.loras - The LoRAs to use for image generation
 * @returns {Promise<Object>} - Generated image data
 */
export const generateImage = async (params) => {
  const isInitialized = initializeFalClient();

  if (!isInitialized) {
    throw new Error("FAL AI API key is not configured");
  }

  try {
    // Set default values for optional parameters
    const input = {
      prompt: params.prompt,
      image_size: params.image_size || "landscape_4_3",
      num_inference_steps: params.num_inference_steps || 28,
      seed: params.seed || Math.floor(Math.random() * 1000000),
      guidance_scale: params.guidance_scale || 3.5,
      num_images: params.num_images || 1,
      enable_safety_checker: params.enable_safety_checker !== false,
      output_format: params.output_format || "jpeg",
      loras: params.loras || [
        {
          path: "https://v3.fal.media/files/kangaroo/eUse-WiCuBAXw4Mn9RuZs_pytorch_lora_weights.safetensors",
          scale: 1,
        },
      ],
    };

    // Generate the image
    console.log("Sending request to FAL AI with params:", input);

    const result = await fal.subscribe("fal-ai/flux-lora", {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Generation in progress:", update.status);
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("Received result from FAL AI:", result);

    // The FAL API returns data in the 'data' property
    const resultData = result.data || result;

    // Ensure the result has the expected structure
    if (!resultData.images || !Array.isArray(resultData.images)) {
      console.error("Invalid result format:", resultData);
      // Create a standardized result with empty images array if missing
      return {
        ...resultData,
        images: [],
      };
    }

    return resultData;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * FAL AI API client
 */
export const falApiClient = {
  /**
   * Generate an image
   * @param {Object} params - Image generation parameters
   * @returns {Promise<Object>} - Generated image data
   */
  generateImage,
};

export default falApiClient;

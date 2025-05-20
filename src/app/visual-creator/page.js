"use client";

import { useState, useEffect } from "react";
import { fal } from "@fal-ai/client";
import { falApiClient } from "@/lib/falApiClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Image as ImageIcon, Download, Sparkles, Wand2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MetaPrompt, getProcessedPrompt } from "@/components/visual-creator/meta-prompt";
import { IMAGE_SIZES, DEFAULT_PROMPT, PROTO_STYLE_TEMPLATE } from "@/components/visual-creator/constants";

export default function VisualCreator() {
  // State for prompt fields
  const [promptFields, setPromptFields] = useState({
    insert_shape_or_subject: "",
    insert_thematic_elements_or_concepts: ""
  });

  // State for form inputs
  const [formData, setFormData] = useState({
    prompt: DEFAULT_PROMPT,
    image_size: "landscape_4_3",
    num_inference_steps: 28,
    seed: Math.floor(Math.random() * 1000000),
    guidance_scale: 3.5,
    num_images: 1,
    enable_safety_checker: true,
    output_format: "jpeg",
  });

  // State for prompt mode (free text or template)
  const [useTemplate, setUseTemplate] = useState(true);

  // State for generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState(null);

  // Initialize FAL client with environment variable on component mount
  useEffect(() => {
    const envApiKey = process.env.NEXT_PUBLIC_FAL_KEY;

    if (envApiKey) {
      fal.config({
        credentials: envApiKey,
      });
      console.log("FAL client initialized with environment variable");
    } else {
      console.warn("No FAL API key found in environment variables");
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Effect to update the prompt when template fields change
  useEffect(() => {
    if (useTemplate) {
      const processedPrompt = getProcessedPrompt(PROTO_STYLE_TEMPLATE, promptFields);
      setFormData(prev => ({ ...prev, prompt: processedPrompt }));
    }
  }, [promptFields, useTemplate]);

  // Handle prompt field changes
  const handlePromptFieldChange = (newFields) => {
    setPromptFields(newFields);
  };

  // Handle toggle between template and free text
  const handleToggleTemplate = () => {
    setUseTemplate(prev => !prev);
    if (!useTemplate) {
      // Switching to template mode
      const processedPrompt = getProcessedPrompt(PROTO_STYLE_TEMPLATE, promptFields);
      setFormData(prev => ({ ...prev, prompt: processedPrompt }));
    }
  };

  // Handle image generation
  const handleGenerate = async () => {
    const envApiKey = process.env.NEXT_PUBLIC_FAL_KEY;

    if (!envApiKey) {
      toast({
        title: "API Key Missing",
        description: "FAL AI API key is not configured in environment variables.",
        variant: "destructive",
      });
      return;
    }

    // Validate template fields if using template
    if (useTemplate) {
      const missingFields = [];
      if (!promptFields.insert_shape_or_subject) missingFields.push("Shape or Subject");
      if (!promptFields.insert_thematic_elements_or_concepts) missingFields.push("Thematic Elements or Concepts");

      if (missingFields.length > 0) {
        toast({
          title: "Missing Fields",
          description: `Please fill in all required fields: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Configure the FAL client with the API key
      fal.config({
        credentials: envApiKey,
      });

      // Add Lora weights
      const params = {
        ...formData,
        loras: [
          {
            path: "https://v3.fal.media/files/kangaroo/eUse-WiCuBAXw4Mn9RuZs_pytorch_lora_weights.safetensors",
            scale: 1,
          },
        ],
      };

      // Generate the image using our API client
      const result = await falApiClient.generateImage(params);

      console.log("Generation result:", result);

      // Set the generated images
      if (result && result.images && result.images.length > 0) {
        console.log("Setting generated images:", result.images);
        setGeneratedImages(result.images);

        toast({
          title: "Image Generated",
          description: "Your image has been successfully generated!",
        });
      } else if (result && result.data && result.data.images && result.data.images.length > 0) {
        // Handle nested data structure
        console.log("Setting generated images from nested data:", result.data.images);
        setGeneratedImages(result.data.images);

        toast({
          title: "Image Generated",
          description: "Your image has been successfully generated!",
        });
      } else {
        console.error("No images returned from API:", result);
        setError("No images were returned from the API. Please try again.");

        toast({
          title: "Generation Issue",
          description: "The API returned successfully but no images were found.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err.message || "Failed to generate image");
      toast({
        title: "Generation Failed",
        description: err.message || "An error occurred while generating the image.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle image download
  const handleDownload = (url, index) => {
    if (!url) {
      console.error("Cannot download: URL is empty");
      toast({
        title: "Download Failed",
        description: "Cannot download the image because the URL is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${formData.seed}-${index}.${formData.output_format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your image download has started.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h1 className="text-2xl font-semibold">Visual Creator</h1>
          <Badge variant="outline" className="ml-2 text-xs bg-yellow-600/20 text-yellow-400 border-yellow-600/20">WIP</Badge>
        </div>
      </div>

      <div className="bg-yellow-600/20 text-yellow-400 p-4 rounded">
        <p className="text-sm">
          <strong>Note:</strong> This is a client-side implementation for demonstration purposes.
          In a production environment, API requests should be proxied through a server to protect API keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Generator</CardTitle>
              <CardDescription>
                Generate images using FAL AI Flux with Lora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prompt Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="prompt-mode" className="text-gray-300 font-light">Prompt Mode</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={useTemplate ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseTemplate(true)}
                    className={useTemplate ? "bg-white text-black hover:bg-gray-200" : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Template
                  </Button>
                  <Button
                    variant={!useTemplate ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseTemplate(false)}
                    className={!useTemplate ? "bg-white text-black hover:bg-gray-200" : "border-gray-700 text-gray-300 hover:bg-gray-800"}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Free Text
                  </Button>
                </div>
              </div>

              {/* Prompt Input */}
              {useTemplate ? (
                <div className="space-y-2">
                  <Label htmlFor="template-prompt" className="text-gray-300 font-light">Proto Style Template</Label>
                  <MetaPrompt
                    template={PROTO_STYLE_TEMPLATE}
                    fieldValues={promptFields}
                    onChange={handlePromptFieldChange}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="prompt">Custom Prompt</Label>
                  <Textarea
                    id="prompt"
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleChange}
                    placeholder="Describe the image you want to generate"
                    rows={4}
                    className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700"
                  />
                </div>
              )}

              {/* Image Size */}
              <div className="space-y-2">
                <Label htmlFor="image_size">Image Size</Label>
                <Select
                  value={formData.image_size}
                  onValueChange={(value) => handleSelectChange("image_size", value)}
                  aria-label="Select image size"
                >
                  <SelectTrigger aria-label="Image size" className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700">
                    <SelectValue placeholder="Select image size" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-800 text-white">
                    {IMAGE_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value} textValue={size.label} className="focus:bg-gray-800 focus:text-white">
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Advanced Options</Label>
                  <Separator className="my-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="num_inference_steps">Inference Steps</Label>
                    <Input
                      id="num_inference_steps"
                      name="num_inference_steps"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.num_inference_steps}
                      onChange={handleChange}
                      className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seed">Seed</Label>
                    <Input
                      id="seed"
                      name="seed"
                      type="number"
                      value={formData.seed}
                      onChange={handleChange}
                      className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guidance_scale">Guidance Scale</Label>
                    <Input
                      id="guidance_scale"
                      name="guidance_scale"
                      type="number"
                      step="0.1"
                      min="1"
                      max="20"
                      value={formData.guidance_scale}
                      onChange={handleChange}
                      className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="num_images">Number of Images</Label>
                    <Input
                      id="num_images"
                      name="num_images"
                      type="number"
                      min="1"
                      max="4"
                      value={formData.num_images}
                      onChange={handleChange}
                      className="bg-[#111] border-gray-800 text-white focus:ring-0 focus:border-gray-700"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="enable_safety_checker"
                    name="enable_safety_checker"
                    checked={formData.enable_safety_checker}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, enable_safety_checker: checked }))
                    }
                  />
                  <Label htmlFor="enable_safety_checker" className="text-sm text-gray-300">Enable Safety Checker</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.prompt}
                className="w-full bg-white text-black hover:bg-gray-200 font-light"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column - Results */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Images</CardTitle>
              </div>
              <CardDescription>
                Your generated images will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {error && (
                <div className="bg-red-600/20 text-red-400 p-4 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="border border-gray-800 rounded-md bg-[#111] p-4 h-[600px] overflow-y-auto">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <RefreshCw className="h-8 w-8 animate-spin mb-2 text-gray-400" />
                    <p className="text-gray-400">Generating your image...</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {generatedImages.map((image, index) => {
                      // Get the URL from the image object, which might have different structures
                      const imageUrl = image.url || (image.content_type && image.url) || '';

                      return (
                        <div key={index} className="relative group">
                          {imageUrl ? (
                            <>
                              <div className="border border-gray-800 rounded-md overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={`Generated image ${index + 1}`}
                                  className="w-full h-auto"
                                  onLoad={() => console.log("Image loaded successfully:", imageUrl)}
                                  onError={(e) => {
                                    console.error("Error loading image:", e, imageUrl);
                                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgZmFpbGVkIHRvIGxvYWQ8L3RleHQ+PC9zdmc+";
                                  }}
                                />
                              </div>
                              <div className="mt-2 flex justify-between items-center">
                                <p className="text-sm text-gray-400">Image #{index + 1}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(imageUrl, index + 1)}
                                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-light"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-64 bg-gray-800 rounded flex items-center justify-center">
                              <p className="text-gray-400">Image URL missing</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon className="h-8 w-8 mb-2" />
                    <p>Generated images will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

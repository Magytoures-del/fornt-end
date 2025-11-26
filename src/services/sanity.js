import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "mhlr2byd",
  dataset: "production",
  apiVersion: "2021-09-29",
  useCdn: true,
  ignoreBrowserTokenWarning: true,
  token:
    "skR0jDWf964OF9Tzm7YMlfru78ToaNCRdUhkxZXuBBTAJQsQ6H2aA5cynMU8TxrXs6Y4xRhAB25EyshH3a30eV8A3OrcVheFzQQLx6Xf6Qin4JraDDv1aU2T61n3ay7KGyVnZzFLYda0nIicaZ58bZWZZnRkliRh7ZSqCzAlzk8CpETYX1pH",
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  if (!source) return "/path/to/default-image.jpg"; // Fallback for missing images
  return builder.image(source).quality(50);
  // Compression quality (75 is a good balance) // Automatically choose WebP or JPEG
};

export const urlForLQIP = (source) => {
  if (!source) return "/path/to/default-placeholder.jpg"; // Fallback for missing images
  return builder
    .image(source)
    .blur(10) // Apply blur effect
    .quality(10) // Very low quality for faster loading
    .auto("format"); // Automatically choose WebP or JPEG
};

export default client;

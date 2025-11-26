import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../config/supabase';

// --- MAPA DE MODELOS ---
export const MODELS = {
  // Usamos Gemini 3 Pro Image Preview gemini-3-pro-image-preview para máxima fidelidad en generación de imágenes
  // También podrías usar "gemini-2.5-flash-image" si prefieres velocidad.
  ARTIST_PRO: "gemini-3-pro-image-preview", 
};


//  1. HEADSHOT (Foto LinkedIn)
const FEATURE_PROMPTS = {
  headshot: `
    Generate a photorealistic professional LinkedIn headshot based on the input image.
     
    **Technical Specifications:**
    - Style: High-end corporate headshot, professional photography.
    - Lighting: Soft studio lighting, Rembrandt lighting, flattering.
    - Camera: 85mm lens, f/1.8 aperture.
    - Resolution: 8k, photorealistic, highly detailed skin texture.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
    
    **Context & Attire:**
    - Clothing: Modern professional business attire (suit, well-fitted blazer, crisp shirt/blouse), neutral or navy colors.
    - Background: Blurred modern office, bokeh, neutral tones, professional setting.
    - REPLACE THE EXPRESSION: The subject must have a **confident, neutral, and friendly professional expression**. A slight, closed-mouth smile is preferred.
        
    **Negative Prompt (Avoid):**
    Cartoon, illustration, 3d render, painting, deformed face, extra fingers, bad anatomy, blurry face, low resolution, distorted eyes, changing ethnicity, changing age.
  `,
  // 2. VIRTUAL STYLIST (Cambio de Outfit)
  stylist: `
  Act as a high-end fashion stylist. Change the subject's outfit to a trendy, modern, and stylish ensemble.
    **Technical Specifications:**
    - Style: Streetwear chic or Smart Casual.
    - Clothing: High-quality fabrics, layered look, fashionable accessories (optional).
    - Background: Simple urban setting or neutral studio background to focus on the outfit.
    - Lighting: Natural daylight or fashion editorial lighting.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,
  
    // 1. ROCKERO 🎸
    stylist_rock: `
    TRANSFORM the subject into a HIGH-FASHION PUNK-ROCK / GOTHIC ICON.
   
     **VISUAL REFERENCE STYLE:**
    Mix of 2000s Pop-Punk (Avril Lavigne), Gothic Industrial, and Edgy Street Style, pop-punk aesthetic and high-end gothic industrial fashion. Edgy, detailed, and powerful.

    **CRITICAL: IGNORE ORIGINAL CLOTHING.**
    If the subject is wearing a suit or formal wear, COMPLETELY REPLACE IT. The output must NOT look corporate.

    **COMPOSITION & FRAMING:**
    - **GOAL:** GENERATE A FULL-BODY OR 3/4 LENGTH SHOT to showcase the entire outfit.
    - If the input is a close-up, infer the rest of the body naturally. Ensure head-to-body proportions are realistic.
    - **Attitude:** Confident, rebellious, slight "model pout" or serious expression.

    **CORE DIRECTIVE: TOTAL CREATIVE FREEDOM**
    You are the Creative Director. I am giving you full artistic control to design the coolest, most cohesive "Rockstar" outfit possible. Do not feel constrained by specific clothing lists. Surprise me with a high-fashion edge.

    **MANDATORY CONSTRAINTS (The Anchors):**
    1.  **GLOW UP (Non-Negotiable):** The subject must look their absolute best. Apply "High-End Beauty Retouching": smooth skin texture, brighten eyes, and ensure the makeup (smokey eyes/dark lips) is flawless.
    2.  **LIGHTING MASTERY:** Use dramatic, cinematic lighting (concert spotlights, neon rim lights, or moody studio softbox). **CRITICAL:** The face must be perfectly lit—no harsh, unflattering shadows under the eyes or nose.
    3.  **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced (like a magazine cover).
    
    **NEGATIVE PROMPT (Avoid):**
    Suit, tie, blazer, office background, clean look, preppy, smiling politely, bright daylight, corporate, business casual, boring clothes, office wear, bad lighting, harsh shadows on face, greasy skin, stiff pose, plastic skin texture, distorted fingers, low resolution.
    `,

  // 2. URBANO 🛹
  stylist_urban: `
    Act as a fashion stylist. Change the outfit to HIGH-END STREETWEAR / HYPEBEAST.
    
    **Technical Specifications:**
    - Clothing: Oversized hoodie, bomber jacket, cargo pants, fresh sneakers, bucket hat or beanie.
    - Background: Graffiti art wall, city rooftop at sunset, or urban skate park.
    - Vibe: Trendy, youthful, street-smart.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 3. VIKINGO ⚔️
  stylist_viking: `
    Transport the subject into a cinematic VIKING FANTASY setting.
    
    **Technical Specifications:**
    - Clothing: Fur-lined leather armor, chainmail details, rough woven fabrics, cape.
    - Background: Misty nordic fjords, snowy mountains, or inside a wooden longhouse with firelight.
    - Lighting: Dramatic, cold blue tones mixed with warm firelight.
    - Vibe: Epic, strong, warrior.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 4. CYBERPUNK 🤖
  stylist_cyberpunk: `
    Transport the subject into a FUTURISTIC CYBERPUNK city.
   
    **Technical Specifications:**
    - Clothing: Techwear, neon glowing accents on jacket, metallic fabrics, futuristic visor or glasses (optional).
    - Background: Rainy futuristic city street with bright neon signs (pink, blue, purple).
    - Lighting: High contrast neon lighting reflecting on skin and clothes.
    - Vibe: Sci-fi, edgy, futuristic.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 3. LUXURY FLEX (Estilo Millonario)
  luxury: `
    Transport the subject into a scene of extreme wealth and luxury.
    
    
    **Technical Specifications:**
    - Setting: Private jet interior (leather seats), a yacht in Monaco, interior of a luxury car or a luxury penthouse.
    - Clothing: "Old money" aesthetic, quiet luxury brands, expensive watch or jewelry.
    - Lighting: Warm, golden hour or sophisticated interior lighting.
    - Vibe: Success, wealth, exclusive.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 4. GLOW UP (Mejora Natural)
  glowup: `
    ACT as a World-Class Beauty Retoucher and Portrait Photographer.
    PERFORM A "HIGH-END GLOW UP" on the subject.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced


    **CORE OBJECTIVE:**
    Elevate the subject's natural beauty to "Magazine Cover" quality. The result must look like the best version of themselves: rested, hydrated, and perfectly lit. NOT plastic or fake.

    **RETOUCHING PROTOCOL:**
    1.  **Skin Perfection:** Achieve "Glass Skin" texture. Remove blemishes, redness, acne, and dark circles. RETAIN natural skin pores (do not blur into plastic). Apply virtual "Frequency Separation".
    2.  **Digital Makeup (The "No-Makeup" Look):**
        - Slightly contour the cheekbones for definition.
        - Add a healthy peach/rosy blush glow.
        - Define and sharpen eyelashes and brows.
        - Lips: Hydrated, soft satin finish (MLBB - My Lips But Better).
    3.  **Eyes:** Brighten the sclera (whites), sharpen the iris, add a subtle "catchlight" reflection to make eyes sparkle and look alive.
    4.  **Hair:** Remove frizz and flyaways, add volume, and enhance shine/gloss.

    **LIGHTING & ATMOSPHERE:**
    - **Lighting:** Soft, diffused "Butterfly Lighting" or "Golden Hour" glow. Eliminate harsh shadows under eyes and nose.
    - **Vibe:** Radiance, confidence, health, "Clean Girl Aesthetic".
    - **Background:** Keep original context if good, but apply a soft, creamy bokeh (blur) to isolate the subject and make them pop.

    **NEGATIVE PROMPT:**
    Plastic skin, airbrushed look, changing facial features, heavy drag makeup, artificial background, low resolution, oily skin, dry lips, flat lighting.
  `,

  // 5. SOCIALS SAVER (Fotos para Instagram)
  socials: `
    Create an engaging, "influencer-style" candid photo for social media.
    
    
    **Technical Specifications:**
    - Style: Candid, lifestyle photography, rule of thirds.
    - Setting: Trendy coffee shop, sunset rooftop, or aesthetic city street.
    - Clothing: Casual but photogenic.
    - Vibe: Relaxed, fun, approachable.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 6. RETRO / TIME TRAVELER (Años 90s)
  retro: `
    Transform the image into a 1990s yearbook photo or vintage aesthetic.
    
    
    **Technical Specifications:**
    - Filter: Film grain, slight color fade, VHS aesthetic.
    - Clothing: 90s fashion (denim jackets, turtlenecks, colorful patterns).
    - Background: Laser background or 90s retro studio pattern.
    - Vibe: Nostalgic, vintage cool.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `
  // Aquí pueden ir mas prompts...
};

console.log("🔑 Iniciando Servicio Gemini (vía Supabase Proxy)...");

export const generateAIImage = async (imageUri: string, featureKey: string, variant: string | null = null): Promise<string | null> => {
  const modelId = MODELS.ARTIST_PRO;
  
  // LÓGICA DE SELECCIÓN DE PROMPT
  let promptKey = featureKey;
  
  // Si hay variante, intentamos construir la clave compuesta
  if (variant) {
      const candidateKey = `${featureKey}_${variant}`;
      if (FEATURE_PROMPTS[candidateKey as keyof typeof FEATURE_PROMPTS]) {
          promptKey = candidateKey;
          console.log(`✅ Variante encontrada y aplicada: ${promptKey}`);
      } else {
          console.warn(`⚠️ Variante "${candidateKey}" no encontrada en prompts. Usando base: ${featureKey}`);
      }
  }
  
  console.log(`🎨 Transformando modo final: ${promptKey}...`);

  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
    
    // Obtenemos el prompt del mapa local
    const systemPrompt = FEATURE_PROMPTS[promptKey as keyof typeof FEATURE_PROMPTS];

    if (!systemPrompt) {
        console.error(`❌ ERROR CRÍTICO: No se encontró prompt para: ${promptKey}`);
        throw new Error("Prompt no configurado.");
    }

    // --- NUEVA LÓGICA SEGURA ---
    // Llamamos a la Edge Function de Supabase
    // Le pasamos el prompt calculado, la imagen y el modelo
    const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: { 
            prompt: systemPrompt,
            imageBase64: base64,
            modelName: modelId 
        }
    });

    if (error) {
        console.error("❌ Error de comunicación con Supabase:", error);
        throw error;
    }

    if (!data || !data.image) {
        throw new Error("Supabase respondió OK, pero no devolvió ninguna imagen.");
    }

    console.log("✅ Imagen generada exitosamente desde la nube.");
    return data.image;

  } catch (error: any) {
    console.error("❌ Error en servicio Gemini:", error);
    return null;
  }
};
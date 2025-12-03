import * as FileSystem from 'expo-file-system/legacy';
import Purchases from 'react-native-purchases'; // ✅ 1. Importar RevenueCat
import { supabase } from '../config/supabase';

// --- MAPA DE MODELOS ---
export const MODELS = {
  // Usamos Gemini 3 Pro Image Preview gemini-3-pro-image-preview para máxima fidelidad en generación de imágenes
  // También podrías usar "gemini-2.5-flash-image" si prefieres velocidad.
  ARTIST_PRO: "gemini-3-pro-image-preview", 
};


// 1. Virtual Try On
const FEATURE_PROMPTS = {

  tryon: `
    Act as an expert AI Virtual Try-On Stylist.
    You have two inputs:
    1. A photo of a PERSON (User).
    2. A photo  from where you have to get the GARMENT/OUTFIT.

    **TASK:**
    Generate a photorealistic full-body image of the PERSON from Image 1 wearing the GARMENT from Image 2.

    **REQUIREMENTS:**
    - **IDENTITY PRESERVATION:** The face, body shape, skin tone, and pose must match the person in Image 1 exactly.
    - **GARMENT TRANSFER:** Replace the person's original clothing with the garment from Image 2. Adapt the fit naturally to the person's pose and body shape.
    - **REALISM:** Pay attention to fabric texture, lighting consistency, folds, and shadows. It must look like a real photo, not a collage.
  `,

  // 2. STYLIST (Cambio de Estilo)
  stylist: `
  Act as a high-end fashion stylist. Change the subject's outfit to a trendy, modern, and stylish ensemble.
    **Technical Specifications:**
    - Style: Streetwear chic or Smart Casual.
    - Clothing: High-quality fabrics, layered look, fashionable accessories (optional).
    - Background: Simple urban setting or neutral studio background to focus on the outfit.
    - Lighting: Natural daylight or fashion editorial lighting.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,
  
    // 2.1. ROCKERO 🎸
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

  // 2.2. URBANO 🛹
  stylist_urban: `
    Act as a fashion stylist. Change the outfit to HIGH-END STREETWEAR / HYPEBEAST.
    
    **Technical Specifications:**
    - Clothing: Oversized hoodie, bomber jacket, cargo pants, fresh sneakers, bucket hat or beanie.
    - Background: Graffiti art wall, city rooftop at sunset, or urban skate park.
    - Vibe: Trendy, youthful, street-smart.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 2.3. VIKINGO ⚔️
  stylist_viking: `
    Transport the subject into a cinematic VIKING FANTASY setting.
    
    **Technical Specifications:**
    - Clothing: Fur-lined leather armor, chainmail details, rough woven fabrics, cape.
    - Background: Misty nordic fjords, snowy mountains, or inside a wooden longhouse with firelight.
    - Lighting: Dramatic, cold blue tones mixed with warm firelight.
    - Vibe: Epic, strong, warrior.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 2.4. CYBERPUNK 🤖
  stylist_cyberpunk: `
    Transport the subject into a FUTURISTIC CYBERPUNK city.
   
    **Technical Specifications:**
    - Clothing: Techwear, neon glowing accents on jacket, metallic fabrics, futuristic visor or glasses (optional).
    - Background: Rainy futuristic city street with bright neon signs (pink, blue, purple).
    - Lighting: High contrast neon lighting reflecting on skin and clothes.
    - Vibe: Sci-fi, edgy, futuristic.
    **IDENTITY:** The face must remain unmistakably the user's face, just visually enhanced
  `,

  // 2.5. RETRO 🤖
  stylist_retro: `
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

    // 6. HAIR STUDIO
   hairstudio: `
    ACT as a Master Hair Colorist and Stylist.
    Your goal is to give the subject a completely new hairstyle while keeping their face identical.
    
    **Technical Specifications:**
    - Focus: Realistic hair texture, shine, and volume.
    - Lighting: Salon quality lighting to highlight hair color dimensions.
    **IDENTITY:** The face, skin tone, and features must remain 100% identical to the user.
  `,
  hairstudio_butterfly: `
    Act as a professional hair stylist. Give the subject a trendy Butterfly Cut.
    
    - Vibe: Viral TikTok style, chic, voluminous.
    **IDENTITY:** The face must remain unmistakably the user's face. Only change the hair.
  `,
  hairstudio_layer: `
    Act as a professional hair stylist. Give the subject a Long Layered Haircut.
    
    **Technical Specifications:**
    - Style: Voluminous, cascading layers that frame the face.
    - Texture: Soft, blown-out salon finish.
    - Length: Retain length but add movement and dimension.
    - Vibe: Elegant, feminine, "supermodel blowout".
    **IDENTITY:** The face must remain unmistakably the user's face. Only change the hair.
  `,
   hairstudio_bob: `
    CHANGE the subject's hair to a chic FRENCH BOB CUT (chin length).
    Style: Sleek, straight, modern.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
   hairstudio_mullet: `
    Act as a visionary stylist. Give the subject a Modern Mullet.
    
    **Technical Specifications:**
    - Style: Shorter sides (fade or taper), significantly longer hair at the back/neck.
    - Texture: Textured top, not messy but edgy.
    **IDENTITY:** The face must remain unmistakably the user's face. Only change the hair.
  `,
   hairstudio_fade: `
    Act as a high-end barber. Give the subject a sharp Taper Fade haircut.
    
    **Technical Specifications:**
    - Style: Clean gradient on the sides and back (fading into skin or very short), keeping length and texture on top.
    - Edges: Crisply lined up (shape-up).
    - Vibe: Professional, clean, modern gentleman.
    **IDENTITY:** The face must remain unmistakably the user's face. Only change the hair.
  `,
   hairstudio_buzzcut: `
    Act as a barber. Give the subject a Buzz Cut.
    
    - Hairline: Sharp and defined box or natural line.
    - Vibe: Rugged, masculine, minimalist, tough.
    **IDENTITY:** The face must remain unmistakably the user's face. Only change the hair.
  `,
  hairstudio_blonde: `
    CHANGE the subject's hair to a LUXURIOUS PLATINUM BLONDE.
    Style: Soft waves, voluminous, expensive-looking. 
    Roots: Slight shadow root for realism (balayage).
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  hairstudio_dark: `
    Change the hair color to a LUXURIOUS DARK CHESTNUT BROWN (Castaño Oscuro).
    
    - Texture: Highly reflective, "glass hair" shine.
    - Vibe: Natural, healthy, sophisticated.
    - Avoid: Pitch black (jet black) or flat color; ensure it has natural brown depth.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  // 3. Balayage
  hairstudio_balayage: `
    Apply a High-End BALAYAGE coloring technique to the hair.
    
    **Technical Specifications:**
    - Transition from darker roots to lighter ends.
    - Tones: Sun-kissed caramel, honey, or sand tones blended into the natural base color.
    - Finish: Multidimensional, soft gradient, expensive salon look.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  hairstudio_red: `
    Change the hair color to an INTENSE COPPER RED with CHESTNUT LOWLIGHTS.
    
    **Color Palette:**
    - Base: Deep, rich metallic copper (Rojo Cobrizo Profundo).
    - Highlights: Subtle chestnut/brown streaks for dimension.
    - Finish: Glossy, hydrated, salon-quality color.
    
    **NEGATIVE PROMPT (CRITICAL):**
    NO orange tones, no carrot color, no bright neon orange, no brassy yellow, no unnatural fantasy red.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
 

  // 7. GLOBETROTTER (Viajero)
  globetrotter: `
    Transport the subject to a world-famous travel destination.
    Adjust the lighting on the subject to match the environment perfectly.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  globetrotter_santorini: `
    Transport the subject to SANTORINI, GREECE.
    Background: White buildings with blue domes, caldera view, sunset.
    Lighting: Golden hour, warm, glowing.
    Vibe: Luxury vacation, influencer travel.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  globetrotter_paris: `
    Transport the subject to PARIS, FRANCE (Eiffel Tower view).
    Vibe: Romantic, overcast soft lighting, fashion week style.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  globetrotter_nyc: `
    Transport the subject to TIMES SQUARE, NEW YORK at night.
    Lighting: Neon lights reflecting on the skin, vibrant, urban.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,

  // 8. FITNESS BODY
  fitness: `
    TRANSFORM the subject into a FITNESS MODEL version of themselves.
    
    **Technical Specifications:**
    - Body: Athletic, toned, muscular but natural.
    - Clothing: Premium sportswear (Nike/Gymshark style).
    - Background: Modern high-end gym or running track.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  fitness_shredded: `
    Make the subject look SHREDDED (low body fat, high muscle definition).
    Lighting: Dramatic overhead gym lighting (downlighting) to accentuate muscles.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,
  fitness_yoga: `
    Physique: Lean, toned, flexible (Yoga/Pilates body).
    Clothing: Yoga leggings and top in neutral colors.
    Background: Peaceful yoga studio with bamboo and soft light.
    **IDENTITY:** The face must remain unmistakably the user's face.
  `,

  // 9. HEADSHOT (Foto LinkedIn)
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
  // Aquí pueden ir mas prompts...
};


console.log("🔑 Iniciando Servicio Gemini (vía Supabase Proxy)...");

// MODIFICACIÓN: Agregamos garmentUri como parámetro opcional al final
export const generateAIImage = async (
  imageUri: string, 
  featureKey: string, 
  variant: string | null = null,
  garmentUri: string | null = null
): Promise<string> => { // ✅ 2. Cambiado a Promise<string> para obligar a manejar el error
  
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
    // ✅ 3. Obtener el ID del Usuario para el cobro
    const appUserID = await Purchases.getAppUserID();
    if (!appUserID) {
        throw new Error("No se pudo identificar al usuario (RevenueCat ID nulo).");
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
    
    // LÓGICA TRY ON: Leemos la segunda imagen si existe
    let garmentBase64 = null;
    if (garmentUri) {
        console.log("👗 Procesando imagen de prenda para Try On...");
        garmentBase64 = await FileSystem.readAsStringAsync(garmentUri, { encoding: 'base64' });
    }
    
    // Obtenemos el prompt del mapa local
    const systemPrompt = FEATURE_PROMPTS[promptKey as keyof typeof FEATURE_PROMPTS];

    if (!systemPrompt) {
        console.error(`❌ ERROR CRÍTICO: No se encontró prompt para: ${promptKey}`);
        throw new Error("Prompt no configurado.");
    }

    // --- NUEVA LÓGICA SEGURA ---
    // Llamamos a la Edge Function de Supabase
    const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: { 
            prompt: systemPrompt,
            imageBase64: base64,
            garmentBase64: garmentBase64, // Enviamos la prenda si existe
            modelName: modelId,
            
            // ✅ 4. DATOS PARA EL SISTEMA DE CRÉDITOS
            user_id: appUserID,     // ID de RevenueCat para saber a quién cobrar
            feature_id: promptKey   // Clave (ej. 'stylist_rock') para saber cuánto cobrar
        }
    });

    // Manejo de Errores de Supabase / Edge Function
    if (error) {
        // Detectar si es error de saldo (402)
        // A veces Supabase envuelve el error HTTP
        if (error instanceof Error && error.message.includes("402")) {
             throw new Error("INSUFFICIENT_CREDITS");
        }
        console.error("❌ Error de comunicación con Supabase:", error);
        throw error;
    }

    // Manejo de Errores de Negocio devueltos por la función
    if (data && data.error) {
        if (data.code === 'INSUFFICIENT_CREDITS' || data.error.includes("Saldo insuficiente")) {
            throw new Error("INSUFFICIENT_CREDITS");
        }
        throw new Error(data.error);
    }

    if (!data || !data.image) {
        throw new Error("Supabase respondió OK, pero no devolvió ninguna imagen.");
    }

    console.log("✅ Imagen generada exitosamente desde la nube.");
    return data.image;

  } catch (error: any) {
    console.error("❌ Error en servicio Gemini:", error);
    // ✅ 5. Relanzamos el error en lugar de devolver null
    // Esto permite que tu UI muestre el Paywall si el mensaje es INSUFFICIENT_CREDITS
    throw error;
  }
};
export const generateOutfitAndText = async (fabricImage, templateType = "A-Line Kurta") => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    console.log(`Calling our Express server at ${API_URL}...`);

    const response = await fetch(`${API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fabricImage, templateType })
    });

    if (!response.ok) {
      throw new Error(`Local server error: ${response.status}`);
    }
    const data = await response.json();
    console.log("Success! Report received from backend:", data.report);

    return data.report;

  } catch (error) {
    console.error("Frontend Fetch Error (Is backend running?):", error);

    // Fallback if the local Node server is completely turned off
    return {
      design_name: "The Royal Silhouette",
      fabric_analysis: "This rich fabric showcases intricate traditional patterns with deep, majestic colors. The subtle metallic threading catches light beautifully.",
      tailoring_instructions: "Opt for a modern straight cut with a subtle A-line flare. Use a sweetheart neckline and sheer full-length sleeves with delicate cuff embroidery.",
      styling_accessories: "Pair with vintage gold jhumkas and a statement choker. A structured leather clutch in espresso brown will complement the look perfectly."
    };
  }
};
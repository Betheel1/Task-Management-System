// src/utils/decodeToken.js
export const decodeToken = () => {
  const token = localStorage.getItem("authToken"); // Replace with your token key
  if (!token) return null;

  try {
    // Decode the token (JWT typically has 3 parts separated by dots)
    const payload = JSON.parse(atob(token.split(".")[1]));
 
    return payload; // Replace with the actual key in your token payload
    
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

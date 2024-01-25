import {
  synchronizeDatabaseWithBlockchain,
  triggerCollectionRevalidation
} from "../services/services.js";

export const performAppInitialization = async () => {
  try {
    console.log("Starting application initialization...");
    await synchronizeDatabaseWithBlockchain();
    await triggerCollectionRevalidation();
    console.log("Application initialization completed.");
  } catch (error) {
    console.error("Error during application initialization:", error);
  }
};

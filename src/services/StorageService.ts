import type { Group } from "@/types";

export class StorageService {
  private static STORAGE_KEY = "visualizer-groups";

  static getGroups(): Group[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration to object-based urls
        return parsed.map((g: any) => ({
          ...g,
          urls: g.urls.map((u: any) => 
            typeof u === 'string' ? { url: u, name: u } : u
          )
        }));
      } catch (e) {
        console.error("Failed to parse groups from localStorage", e);
      }
    }
    return [];
  }

  static saveGroups(groups: Group[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(groups));
  }

  static exportGroups(groups: Group[]): void {
    const dataStr = JSON.stringify(groups, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "groups-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  static importGroups(file: File): Promise<Group[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            // Ensure migration on import too
            const migrated = parsed.map((g: any) => ({
              ...g,
              urls: g.urls.map((u: any) => 
                typeof u === 'string' ? { url: u, name: u } : u
              )
            }));
            resolve(migrated);
          } else {
            reject(new Error("Invalid JSON format"));
          }
        } catch (error) {
          reject(new Error("Error parsing JSON file"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  }
}

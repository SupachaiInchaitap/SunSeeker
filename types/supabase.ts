// types/supabase.ts
export type Database = {
    public: {
      Tables: {
        user_favorites: {
          Row: {
            id: number;
            user_id: string;
            city: string;
            lat: number;
            lon: number;
          };
          Insert: {
            user_id: string;
            city: string;
            lat: number;
            lon: number;
          };
          Update: {
            city?: string;
            lat?: number;
            lon?: number;
          };
        };
      };
    };
  };
  
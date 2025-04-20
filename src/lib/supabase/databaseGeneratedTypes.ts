export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      characters: {
        Row: {
          game_name: string | null
          id: number
          moveset: Json | null
          name: string
        }
        Insert: {
          game_name?: string | null
          id?: number
          moveset?: Json | null
          name?: string
        }
        Update: {
          game_name?: string | null
          id?: number
          moveset?: Json | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_game_name_fkey"
            columns: ["game_name"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["name"]
          },
        ]
      }
      combos: {
        Row: {
          character_name: string | null
          created_at: string
          creator_profile_name: string | null
          creator_uid: string | null
          damage: number
          game_name: string | null
          id: number
          like_count: number
          move_ids: string[] | null
          title: string
          url_id: string
        }
        Insert: {
          character_name?: string | null
          created_at?: string
          creator_profile_name?: string | null
          creator_uid?: string | null
          damage?: number
          game_name?: string | null
          id?: number
          like_count?: number
          move_ids?: string[] | null
          title?: string
          url_id?: string
        }
        Update: {
          character_name?: string | null
          created_at?: string
          creator_profile_name?: string | null
          creator_uid?: string | null
          damage?: number
          game_name?: string | null
          id?: number
          like_count?: number
          move_ids?: string[] | null
          title?: string
          url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "combos_character_name_fkey"
            columns: ["character_name"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "combos_creator_profile_name_fkey"
            columns: ["creator_profile_name"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_name"]
          },
          {
            foreignKeyName: "combos_game_name_fkey"
            columns: ["game_name"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["name"]
          },
        ]
      }
      games: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          description: string | null
          id: string
          profile_name: string
        }
        Insert: {
          description?: string | null
          id?: string
          profile_name: string
        }
        Update: {
          description?: string | null
          id?: string
          profile_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_profile_name_valid: {
        Args: {
          name: string
          minlength?: number
          maxlength?: number
          alphabet?: string
        }
        Returns: boolean
      }
      nanoid: {
        Args: {
          size?: number
          alphabet?: string
          additionalbytesfactor?: number
        }
        Returns: string
      }
      nanoid_optimized: {
        Args: { size: number; alphabet: string; mask: number; step: number }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

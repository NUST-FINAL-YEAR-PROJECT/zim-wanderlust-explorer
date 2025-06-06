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
      accommodations: {
        Row: {
          additional_images: string[] | null
          amenities: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          max_guests: number | null
          name: string
          price_per_night: number
          rating: number | null
          review_count: number | null
          room_types: Json | null
          updated_at: string
        }
        Insert: {
          additional_images?: string[] | null
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_guests?: number | null
          name: string
          price_per_night: number
          rating?: number | null
          review_count?: number | null
          room_types?: Json | null
          updated_at?: string
        }
        Update: {
          additional_images?: string[] | null
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_guests?: number | null
          name?: string
          price_per_night?: number
          rating?: number | null
          review_count?: number | null
          room_types?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      api_docs: {
        Row: {
          created_at: string
          description: string | null
          endpoint_path: string
          id: string
          method: string
          request_schema: Json | null
          response_schema: Json | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          endpoint_path: string
          id?: string
          method: string
          request_schema?: Json | null
          response_schema?: Json | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          endpoint_path?: string
          id?: string
          method?: string
          request_schema?: Json | null
          response_schema?: Json | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_details: Json | null
          cancellation_date: string | null
          cancellation_reason: string | null
          completion_date: string | null
          confirmation_date: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          destination_id: string | null
          event_id: string | null
          id: string
          number_of_people: number
          payment_id: string | null
          payment_proof_uploaded_at: string | null
          payment_proof_url: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          preferred_date: string | null
          selected_ticket_type: Json | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_details?: Json | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          completion_date?: string | null
          confirmation_date?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          destination_id?: string | null
          event_id?: string | null
          id?: string
          number_of_people: number
          payment_id?: string | null
          payment_proof_uploaded_at?: string | null
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          preferred_date?: string | null
          selected_ticket_type?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_details?: Json | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          completion_date?: string | null
          confirmation_date?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          destination_id?: string | null
          event_id?: string | null
          id?: string
          number_of_people?: number
          payment_id?: string | null
          payment_proof_uploaded_at?: string | null
          payment_proof_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          preferred_date?: string | null
          selected_ticket_type?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          destination_id: string | null
          event_id: string | null
          id: string
          preferred_date: string | null
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_id?: string | null
          event_id?: string | null
          id?: string
          preferred_date?: string | null
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination_id?: string | null
          event_id?: string | null
          id?: string
          preferred_date?: string | null
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          activities: string[] | null
          additional_costs: Json | null
          additional_images: string[] | null
          amenities: string[] | null
          best_time_to_visit: string | null
          categories: string[] | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_recommended: string | null
          getting_there: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          payment_url: string | null
          price: number
          updated_at: string
          weather_info: string | null
          what_to_bring: string[] | null
        }
        Insert: {
          activities?: string[] | null
          additional_costs?: Json | null
          additional_images?: string[] | null
          amenities?: string[] | null
          best_time_to_visit?: string | null
          categories?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_recommended?: string | null
          getting_there?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          payment_url?: string | null
          price: number
          updated_at?: string
          weather_info?: string | null
          what_to_bring?: string[] | null
        }
        Update: {
          activities?: string[] | null
          additional_costs?: Json | null
          additional_images?: string[] | null
          amenities?: string[] | null
          best_time_to_visit?: string | null
          categories?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_recommended?: string | null
          getting_there?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          payment_url?: string | null
          price?: number
          updated_at?: string
          weather_info?: string | null
          what_to_bring?: string[] | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          event_type: string | null
          id: string
          image_url: string | null
          location: string | null
          payment_url: string | null
          price: number | null
          program_name: string | null
          program_type: string | null
          program_url: string | null
          start_date: string | null
          ticket_types: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          payment_url?: string | null
          price?: number | null
          program_name?: string | null
          program_type?: string | null
          program_url?: string | null
          start_date?: string | null
          ticket_types?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          payment_url?: string | null
          price?: number | null
          program_name?: string | null
          program_type?: string | null
          program_url?: string | null
          start_date?: string | null
          ticket_types?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          share_code: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          share_code?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          share_code?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      itinerary_destinations: {
        Row: {
          created_at: string
          destination_id: string
          end_date: string
          id: string
          itinerary_id: string
          name: string
          notes: string | null
          order: number
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_id: string
          end_date: string
          id?: string
          itinerary_id: string
          name: string
          notes?: string | null
          order: number
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_id?: string
          end_date?: string
          id?: string
          itinerary_id?: string
          name?: string
          notes?: string | null
          order?: number
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_destinations_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_read?: boolean | null
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          payment_details: Json | null
          payment_gateway: string | null
          payment_gateway_reference: string | null
          payment_intent_id: string | null
          payment_method: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_gateway_reference?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_gateway?: string | null
          payment_gateway_reference?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_locked: boolean | null
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          is_locked?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_locked?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          destination_id: string
          id: string
          images: string[] | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          destination_id: string
          id?: string
          images?: string[] | null
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          destination_id?: string
          id?: string
          images?: string[] | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          destination_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_similar_destinations: {
        Args: { destination_id: string }
        Returns: {
          id: string
          name: string
          description: string
          location: string
          price: number
          image_url: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      audit_action:
        | "CREATE"
        | "UPDATE"
        | "DELETE"
        | "LOGIN"
        | "LOGOUT"
        | "ROLE_CHANGE"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
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
    Enums: {
      audit_action: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "ROLE_CHANGE",
      ],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
    },
  },
} as const

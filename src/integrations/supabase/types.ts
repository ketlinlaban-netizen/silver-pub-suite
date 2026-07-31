export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_pins: {
        Row: {
          created_at: string | null
          id: string
          pin: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pin: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pin?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          details: Json | null
          entity: string | null
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          details?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          address: string | null
          business_name: string
          currency: string
          email: string | null
          id: string
          phone: string | null
          receipt_footer: string | null
          receipt_width: string
          tax_rate: number
          till_number: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_name?: string
          currency?: string
          email?: string | null
          id?: string
          phone?: string | null
          receipt_footer?: string | null
          receipt_width?: string
          tax_rate?: number
          till_number?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_name?: string
          currency?: string
          email?: string | null
          id?: string
          phone?: string | null
          receipt_footer?: string | null
          receipt_width?: string
          tax_rate?: number
          till_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      dispensing_sessions: {
        Row: {
          collected_revenue: number
          created_at: string
          dispensed_quantity: number
          expected_revenue: number
          id: string
          is_closed: boolean
          opening_quantity: number
          opening_value: number
          outstanding: number
          returned_quantity: number
          shift_id: string | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          collected_revenue?: number
          created_at?: string
          dispensed_quantity?: number
          expected_revenue?: number
          id?: string
          is_closed?: boolean
          opening_quantity?: number
          opening_value?: number
          outstanding?: number
          returned_quantity?: number
          shift_id?: string | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          collected_revenue?: number
          created_at?: string
          dispensed_quantity?: number
          expected_revenue?: number
          id?: string
          is_closed?: boolean
          opening_quantity?: number
          opening_value?: number
          outstanding?: number
          returned_quantity?: number
          shift_id?: string | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispensing_sessions_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispensing_sessions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dispensing_units"
            referencedColumns: ["id"]
          },
        ]
      }
      dispensing_units: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispensing_units_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          recorded_by: string | null
          shift_id: string | null
          title: string
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          recorded_by?: string | null
          shift_id?: string | null
          title: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          recorded_by?: string | null
          shift_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          balance_after: number | null
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          product_id: string | null
          product_name: string | null
          quantity: number
          reference: string | null
          type: Database["public"]["Enums"]["movement_type"]
        }
        Insert: {
          balance_after?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number
          reference?: string | null
          type: Database["public"]["Enums"]["movement_type"]
        }
        Update: {
          balance_after?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number
          reference?: string | null
          type?: Database["public"]["Enums"]["movement_type"]
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          category_id: string | null
          cost_price: number
          created_at: string
          id: string
          image_url: string | null
          is_favorite: boolean
          max_stock: number
          min_stock: number
          name: string
          selling_price: number
          sku: string | null
          status: Database["public"]["Enums"]["product_status"]
          stock_quantity: number
          tax_rate: number
          unit: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean
          max_stock?: number
          min_stock?: number
          name: string
          selling_price?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          tax_rate?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean
          max_stock?: number
          min_stock?: number
          name?: string
          selling_price?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          tax_rate?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          last_login_at: string | null
          national_id: string | null
          phone: string | null
          photo_url: string | null
          status: Database["public"]["Enums"]["employment_status"]
          updated_at: string
          username: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          last_login_at?: string | null
          national_id?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["employment_status"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          last_login_at?: string | null
          national_id?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["employment_status"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      purchase_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          product_id: string | null
          product_name: string
          purchase_id: string
          quantity: number
          unit_cost: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total?: number
          product_id?: string | null
          product_name: string
          purchase_id: string
          quantity?: number
          unit_cost?: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          product_id?: string | null
          product_name?: string
          purchase_id?: string
          quantity?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          balance: number
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          paid_amount: number
          payment_status: Database["public"]["Enums"]["payment_status"]
          reference: string
          status: Database["public"]["Enums"]["purchase_status"]
          supplier_id: string | null
          total: number
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference?: string
          status?: Database["public"]["Enums"]["purchase_status"]
          supplier_id?: string | null
          total?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference?: string
          status?: Database["public"]["Enums"]["purchase_status"]
          supplier_id?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          cost_price: number
          created_at: string
          discount: number
          id: string
          line_total: number
          note: string | null
          product_id: string | null
          product_name: string
          quantity: number
          sale_id: string
          unit_price: number
        }
        Insert: {
          cost_price?: number
          created_at?: string
          discount?: number
          id?: string
          line_total?: number
          note?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          sale_id: string
          unit_price?: number
        }
        Update: {
          cost_price?: number
          created_at?: string
          discount?: number
          id?: string
          line_total?: number
          note?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount_received: number
          cash_amount: number
          cashier_id: string | null
          cashier_name: string | null
          change_due: number
          cost_total: number
          created_at: string
          customer_name: string | null
          discount: number
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          mpesa_amount: number
          notes: string | null
          profit: number
          receipt_number: string
          shift_id: string | null
          status: Database["public"]["Enums"]["sale_status"]
          subtotal: number
          tab_id: string | null
          tax: number
          total: number
        }
        Insert: {
          amount_received?: number
          cash_amount?: number
          cashier_id?: string | null
          cashier_name?: string | null
          change_due?: number
          cost_total?: number
          created_at?: string
          customer_name?: string | null
          discount?: number
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          mpesa_amount?: number
          notes?: string | null
          profit?: number
          receipt_number?: string
          shift_id?: string | null
          status?: Database["public"]["Enums"]["sale_status"]
          subtotal?: number
          tab_id?: string | null
          tax?: number
          total?: number
        }
        Update: {
          amount_received?: number
          cash_amount?: number
          cashier_id?: string | null
          cashier_name?: string | null
          change_due?: number
          cost_total?: number
          created_at?: string
          customer_name?: string | null
          discount?: number
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          mpesa_amount?: number
          notes?: string | null
          profit?: number
          receipt_number?: string
          shift_id?: string | null
          status?: Database["public"]["Enums"]["sale_status"]
          subtotal?: number
          tab_id?: string | null
          tax?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_tab_id_fkey"
            columns: ["tab_id"]
            isOneToOne: false
            referencedRelation: "tabs"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          approved_by: string | null
          cash_sales: number
          cashier_id: string
          cashier_name: string
          closed_at: string | null
          closing_cash_counted: number | null
          created_at: string
          dispensing_balance: number
          expected_cash: number | null
          expenses_total: number
          id: string
          mpesa_sales: number
          notes: string | null
          opened_at: string
          opening_cash: number
          opening_mpesa: number
          outstanding_bills: number
          refunds: number
          status: Database["public"]["Enums"]["shift_status"]
          total_sales: number
          updated_at: string
          variance: number | null
        }
        Insert: {
          approved_by?: string | null
          cash_sales?: number
          cashier_id: string
          cashier_name?: string
          closed_at?: string | null
          closing_cash_counted?: number | null
          created_at?: string
          dispensing_balance?: number
          expected_cash?: number | null
          expenses_total?: number
          id?: string
          mpesa_sales?: number
          notes?: string | null
          opened_at?: string
          opening_cash?: number
          opening_mpesa?: number
          outstanding_bills?: number
          refunds?: number
          status?: Database["public"]["Enums"]["shift_status"]
          total_sales?: number
          updated_at?: string
          variance?: number | null
        }
        Update: {
          approved_by?: string | null
          cash_sales?: number
          cashier_id?: string
          cashier_name?: string
          closed_at?: string | null
          closing_cash_counted?: number | null
          created_at?: string
          dispensing_balance?: number
          expected_cash?: number | null
          expenses_total?: number
          id?: string
          mpesa_sales?: number
          notes?: string | null
          opened_at?: string
          opening_cash?: number
          opening_mpesa?: number
          outstanding_bills?: number
          refunds?: number
          status?: Database["public"]["Enums"]["shift_status"]
          total_sales?: number
          updated_at?: string
          variance?: number | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          outstanding_balance: number
          phone: string | null
          products_supplied: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          outstanding_balance?: number
          phone?: string | null
          products_supplied?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          outstanding_balance?: number
          phone?: string | null
          products_supplied?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tab_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          note: string | null
          received_by: string | null
          shift_id: string | null
          tab_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          note?: string | null
          received_by?: string | null
          shift_id?: string | null
          tab_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          note?: string | null
          received_by?: string | null
          shift_id?: string | null
          tab_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tab_payments_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tab_payments_tab_id_fkey"
            columns: ["tab_id"]
            isOneToOne: false
            referencedRelation: "tabs"
            referencedColumns: ["id"]
          },
        ]
      }
      tabs: {
        Row: {
          balance: number
          closed_at: string | null
          created_at: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          opened_by: string | null
          paid_amount: number
          shift_id: string | null
          status: Database["public"]["Enums"]["tab_status"]
          table_number: string | null
          total_amount: number
          updated_at: string
          waiter: string | null
        }
        Insert: {
          balance?: number
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          opened_by?: string | null
          paid_amount?: number
          shift_id?: string | null
          status?: Database["public"]["Enums"]["tab_status"]
          table_number?: string | null
          total_amount?: number
          updated_at?: string
          waiter?: string | null
        }
        Update: {
          balance?: number
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          opened_by?: string | null
          paid_amount?: number
          shift_id?: string | null
          status?: Database["public"]["Enums"]["tab_status"]
          table_number?: string | null
          total_amount?: number
          updated_at?: string
          waiter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tabs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabs_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_manager: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "administrator"
        | "manager"
        | "cashier"
        | "store_keeper"
        | "supervisor"
        | "owner"
      employment_status: "active" | "suspended" | "terminated"
      movement_type:
        | "receive"
        | "sale"
        | "adjustment"
        | "transfer"
        | "damaged"
        | "expired"
        | "return"
        | "count"
      payment_method: "cash" | "mpesa" | "split" | "credit"
      payment_status: "unpaid" | "partial" | "paid"
      product_status: "active" | "inactive"
      purchase_status: "draft" | "received" | "cancelled"
      sale_status: "paid" | "open" | "void" | "refunded"
      shift_status: "open" | "pending_approval" | "approved" | "rejected"
      tab_status: "open" | "paid" | "void"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "administrator",
        "manager",
        "cashier",
        "store_keeper",
        "supervisor",
        "owner",
      ],
      employment_status: ["active", "suspended", "terminated"],
      movement_type: [
        "receive",
        "sale",
        "adjustment",
        "transfer",
        "damaged",
        "expired",
        "return",
        "count",
      ],
      payment_method: ["cash", "mpesa", "split", "credit"],
      payment_status: ["unpaid", "partial", "paid"],
      product_status: ["active", "inactive"],
      purchase_status: ["draft", "received", "cancelled"],
      sale_status: ["paid", "open", "void", "refunded"],
      shift_status: ["open", "pending_approval", "approved", "rejected"],
      tab_status: ["open", "paid", "void"],
    },
  },
} as const

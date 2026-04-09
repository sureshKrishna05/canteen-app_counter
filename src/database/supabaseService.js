import { supabase } from "./supabaseClient";

// ─── Auth ────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ─── Profile ─────────────────────────────────────────────────────
export const getMyProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ─── Canteen ─────────────────────────────────────────────────────
export const getMyCanteen = async (canteenId) => {
  const { data, error } = await supabase
    .from("canteens")
    .select("*")
    .eq("id", canteenId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const toggleCanteenStatus = async (canteenId, isOpen) => {
  const { data, error } = await supabase
    .from("canteens")
    .update({ is_open: isOpen })
    .eq("id", canteenId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── Menu Items ──────────────────────────────────────────────────
export const getMenuItems = async (canteenId) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("canteen_id", canteenId)
    .order("category")
    .order("name");
  if (error) throw error;
  return data ?? [];
};

export const addMenuItem = async (item) => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateMenuItem = async (id, updates) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteMenuItem = async (id) => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
};

export const toggleMenuItemAvailability = async (id, isAvailable) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── Orders ──────────────────────────────────────────────────────

// Fetch orders for a canteen filtered by one or more statuses
export const getOrdersByStatus = async (canteenId, statuses) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      payment_status,
      total_amount,
      created_at,
      student_id,
      profiles:student_id ( full_name ),
      order_items (
        id,
        quantity,
        price_at_time,
        menu_items ( id, name )
      )
    `)
    .eq("canteen_id", canteenId)
    .in("status", statuses)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Subscribe to real-time order changes for a canteen
export const subscribeToOrders = (canteenId, onUpdate) => {
  return supabase
    .channel(`orders:canteen:${canteenId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `canteen_id=eq.${canteenId}`,
      },
      onUpdate
    )
    .subscribe();
};
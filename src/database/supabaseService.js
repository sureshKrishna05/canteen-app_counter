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
  try {
    // 1. Safely check the current user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // If the token is expired/invalid, clear it safely
    if (authError || !user) {
      await supabase.auth.signOut(); 
      return null;
    }

    // 2. Fetch the profile data
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    // Catch database/RLS errors without crashing
    if (error) {
      console.error("Supabase Profile Error:", error.message);
      return null; 
    }
    
    return data;
  } catch (err) {
    // Catch any other unexpected network crashes
    console.error("Crash prevented in getMyProfile:", err);
    return null;
  }
};

// ─── Canteen ─────────────────────────────────────────────────────
export const getMyCanteen = async (canteenId) => {
  if (!canteenId) return null; // Safety guard!

  try {
    const { data, error } = await supabase
      .from("canteens")
      .select("*")
      .eq("id", canteenId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching canteen:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Crash prevented in getMyCanteen:", err);
    return null;
  }
};

export const toggleCanteenStatus = async (canteenId, isOpen) => {
  if (!canteenId) throw new Error("No canteen ID provided");
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
  if (!canteenId) return []; // Safety guard!

  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("canteen_id", canteenId)
      .order("category")
      .order("name");
      
    if (error) {
      console.error("Error fetching menu items:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Crash prevented in getMenuItems:", err);
    return [];
  }
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
  if (!canteenId) return []; // Safety guard!

  try {
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

    if (error) {
      console.error("Error fetching orders:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Crash prevented in getOrdersByStatus:", err);
    return [];
  }
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
  if (!canteenId) return { unsubscribe: () => {} }; // Safety guard!
  
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
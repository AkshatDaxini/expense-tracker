import supabase from "../services/supabase"; // Make sure to import your Supabase client

// Function to fetch all expenses for the authenticated user
export const getAllExpenses = async () => {
  try {
    const { data, error } = await supabase.from("Expenses").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
};

export const getExpensesBasedOnEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("Expenses")
      .select("*")
      .eq("email_id", email); // Assuming the Expenses table has a column 'email'

    if (error) throw error;
    return data; // Returns the data if no error
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
};

// Function to insert a new expense record
export const insertExpense = async (expenseData) => {
  try {
    const { data, error } = await supabase
      .from("Expenses")
      .insert([expenseData]); // Insert the expense data

    if (error) throw error;

    return data; // Return the inserted data if no error
  } catch (error) {
    console.error("Error inserting expense:", error);
    return null;
  }
};

// Function to update an expense record
export const updateExpense = async (expenseId, updatedData) => {
  try {
    const { data, error } = await supabase
      .from("Expenses")
      .update(updatedData) // Update the data
      .eq("id", expenseId)
      .eq("email_id", updatedData.email_id); // Match by expense ID

    if (error) throw error;

    return data; // Return the updated data if no error
  } catch (error) {
    console.error("Error updating expense:", error);
    return null;
  }
};

// Function to delete an expense record
export const deleteExpense = async (expenseId, email_id) => {
  try {
    if (!expenseId) {
      throw new Error("Expense ID is required");
    }

    const { data, error } = await supabase
      .from("Expenses")
      .delete() // Delete the expense record
      .eq("email_id", email_id) // Match by expense ID
      .eq("id", expenseId); // Match by expense ID

    if (error) throw error;

    return data; // Return the deleted data if no error
  } catch (error) {
    console.error("Error deleting expense:", error);
    return null;
  }
};

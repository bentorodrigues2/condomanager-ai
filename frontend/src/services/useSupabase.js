export function useSupabaseTable() {
  return {
    data: [],
    loading: false,
    error: null,
    refresh: () => {}
  };
}

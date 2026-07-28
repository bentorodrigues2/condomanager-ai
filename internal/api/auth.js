
export function fakeLogin(role) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ role }), 500);
    });
}

export const setSessionStorageUser = (user) => {
    sessionStorage.setItem('userID', user.userID);
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('allTags', user.allTags);
}
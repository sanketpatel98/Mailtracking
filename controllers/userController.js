import { addUser,deleteUser } from "../services/userService.js";

export const createUser = async (req, res) => {
    try {
        const username = req.body.username;
        await addUser(username);
        res.json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const removeUser = async (req, res) => {
    try {
        const username = req.params.id;
        await deleteUser(username);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

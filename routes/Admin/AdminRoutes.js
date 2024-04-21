const express = require("express");
const {
  auth_admin_login,
  admin_logout,
  admin_profile,
  admin_update_profile,
  admin_add_item,
  admin_update_item,
  admin_remove_item,
  admin_add_worker,
  admin_remove_worker,
  admin_add_raw,
  admin_update_raw,
  admin_remove_raw,
  auth_admin_signup,
  is_logged,
  admin_get_item,
  admin_confirmed_orders,
  admin_accept_orders,
  admin_refuse_orders,
  admin_update_raw_by_order,
} = require("../../controllers/Admin/AdminController");
const router = express.Router();
const { requireAdminAuth } = require("../../middleware/authAdminMiddleware");

// admin profile routes
router.post("/isLogged", requireAdminAuth, is_logged);
router.post("/login", auth_admin_login);
router.post("/signup", auth_admin_signup);
router.post("/logout", admin_logout);
router
  .route("/profile")
  .get(requireAdminAuth, admin_profile)
  .put(requireAdminAuth, admin_update_profile);
// admin control items
router.post("/getItem", requireAdminAuth, admin_get_item);
router.post("/addItem", requireAdminAuth, admin_add_item);
router.put("/updateItem", requireAdminAuth, admin_update_item);
router.post("/removeItem", requireAdminAuth, admin_remove_item);
// admin control raw items
router.post("/addRaw", requireAdminAuth, admin_add_raw);
router.put("/updateRaw", requireAdminAuth, admin_update_raw);
router.post("/removeRaw", requireAdminAuth, admin_remove_raw);
router.post("/orderUpdateRaw", requireAdminAuth, admin_update_raw_by_order);
// admin control workers
router.post("/addWorker", requireAdminAuth, admin_add_worker);
router.post("/removeWorker", requireAdminAuth, admin_remove_worker);

router.post("/userOrders", requireAdminAuth, admin_confirmed_orders);
router.post("/acceptOrders", requireAdminAuth, admin_accept_orders);
router.post("/refuseOrders", requireAdminAuth, admin_refuse_orders);

module.exports = router;

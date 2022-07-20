import md5 from 'md5';
import pool from '../config/connectDatabase'
//[GET]
class AdminController {
    //[GET] Page login
    login = (req, res) => {
        if (req.signedCookies.email) {
            res.redirect('/admin/home');
            return;
        }
        return res.render('admin/login.ejs', { err: '' })
    }

    //GET home page login
    getHomepage = (req, res) => {
        if (req.signedCookies.email) {
            return res.render('admin/home.ejs', { data: req.data[0], url: req.url })
        }
    }
    //GET checklogin page
    checkuser = async (req, res) => {
        const { user_name, password } = req.body;
        const hashPassword = md5(Number(password));
        if (!user_name || !password) { return }
        const sql = `SELECT * FROM thanhvien WHERE email = '${user_name}' AND mat_khau = '${hashPassword}'`;
        const [rows] = await pool.execute(sql);
        if (rows.length > 0 && rows[0].quyen_truy_cap === 2) {
            res.cookie('email', rows[0].email, {
                signed: true,
            });
            res.render('admin/home.ejs', { data: rows[0], url: req.url })
            return;
        }
        else {
            res.render('admin/login.ejs', { err: 'Sai tài khoản hoặc mật khẩu' })
            return;
        }
    }
    //GET User by id
    editUser = async (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM thanhvien WHERE id_thanhvien = ${id}`;
        const [rows] = await pool.execute(sql);
        res.render('admin/editUser.ejs', { data: rows[0], url: req.url })
        // return;
    }

    //GET User update
    updateUser = async (req, res) => {
        const { id } = req.params;
        const { sdt, cmnd, address, name, email } = req.body;
        const sql = `UPDATE thanhvien SET sdt = '${sdt}', cmnd = '${cmnd}', address = '${address}', name = '${name}', email = '${email}' WHERE id_thanhvien = ${id}`;
        await pool.execute(sql);
        res.redirect('/admin/home');
    }
    // LOGOUT
    logout = (req, res) => {
        res.clearCookie('email');
        return res.redirect('/admin');
    }

    //GET account page
    account = async (req, res) => {
        const sql = `SELECT * FROM thanhvien`;
        const [rows] = await pool.execute(sql);
        return res.render('admin/account.ejs', { data: rows, url: req.url })
    }
    //GET create account page
    getCreateAccount = async (req, res) => {
        return res.render('admin/createAccount.ejs', { url: req.url })
    }
    //POST create account page
    createAccount = async (req, res) => {
        const { sdt, cmnd, address, name, email, password } = req.body;
        const hashPassword = md5(Number(password));
        const sql = `INSERT INTO thanhvien (sdt, cmnd, address, name, email, mat_khau) VALUES ('${sdt}', '${cmnd}', '${address}', '${name}', '${email}', '${hashPassword}')`;
        await pool.execute(sql);
        res.redirect('/admin/account');
    }
    // delete account page
    deleteAccount = async (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM thanhvien WHERE id_thanhvien = ${id}`;
        await pool.execute(sql);
        return res.redirect('/admin/account');
    }

    //GET categories page
    categories = async (req, res) => {
        const sql = `SELECT * FROM dmsanpham`;
        const [rows] = await pool.execute(sql);
        return res.render('admin/categories.ejs', { data: rows, url: req.url })
    }

    // delete categories page
    deleteCategory = async (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM dmsanpham WHERE id_dm = ${id}`;
        await pool.execute(sql);
        return res.redirect('/admin/categories');
    }

    // edit categories page
    editCategory = async (req, res) => {
        //get category by id
        const { id } = req.params;
        const sql = `SELECT * FROM dmsanpham WHERE id_dm = ${id}`;
        const [rows] = await pool.execute(sql);
        return res.render('admin/editCategory.ejs', { data: rows[0], url: req.url })
    }

    // update categories 
    updateCategory = async (req, res) => {
        const { ten_dm } = req.body;
        const { id } = req.params;
        const sql = `UPDATE dmsanpham SET ten_dm = '${ten_dm}' WHERE id_dm = ${id}`;
        await pool.execute(sql);
        console.log("Checkk SQL>>>>>>>", sql);
        return res.redirect('/admin/categories');
    }

    //GET create categories page
    getCreateCategory = async (req, res) => {
        return res.render('admin/createCategories.ejs', { url: req.url })
    }
    //POST create categories page
    createCategory = async (req, res) => {
        const { ten_dm } = req.body;
        const sql = `INSERT INTO dmsanpham (ten_dm) VALUES ('${ten_dm}')`;
        await pool.execute(sql);
        return res.redirect('/admin/categories');
    }

    // Get bills page
    bills = async (req, res) => {
        const sql = `SELECT * FROM hoa_don`;
        const [rows] = await pool.execute(sql);
        return res.render('admin/bills.ejs', { data: rows, url: req.url })
    }

    // delete bills 
    deleteBill = async (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM hoa_don WHERE id  = ${id}`;
        console.log("Checkk SQL:>>>>>", sql);
        await pool.execute(sql);
        return res.redirect('/admin/bills');
    }
    // GET products page
    products = async (req, res) => {
        const sql = `SELECT * FROM sanpham`;
        const [rows] = await pool.execute(sql);
        return res.render('admin/products.ejs', { data: rows, url: req.url })
    }
    // delete products
    deleteProduct = async (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM sanpham WHERE id_sp = ${id}`;
        await pool.execute(sql);
        return res.redirect('/admin/products');
    }
    // GET edit product page
    editProduct = async (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM sanpham WHERE id_sp = ${id}`;
        const [rows] = await pool.execute(sql);
        return res.render('admin/editProduct.ejs', { data: rows[0], url: req.url })
    }
    // update product
    updateProduct = async (req, res) => {
        const { ten_sp, gia_sp, trang_thai, ma_dm } = req.body;
        const { id } = req.params;
        const sql = `UPDATE sanpham SET ten_sp = '${ten_sp}', gia_sp = ${gia_sp}, trang_thai = '${trang_thai}', id_dm = ${ma_dm} WHERE id_sp = ${id}`;
        await pool.execute(sql);
        return res.redirect('/admin/products');
    }
    // GET create product page
    getCreateProduct = async (req, res) => {
        return res.render('admin/createProduct.ejs', { url: req.url })
    }
    //POST create product page
    createProduct = async (req, res) => {
        const { ten_sp, gia_sp, trang_thai, ma_dm, khuyen_mai, description } = req.body;
        const sql = `INSERT INTO sanpham (id_sp,id_dm, ten_sp, anh_sp,gia_sp, khuyen_mai, trang_thai,chi_tiet_sp) VALUES (NULL, ${ma_dm}, '${ten_sp}', 'NULL', FLOOR('${gia_sp}'), '${khuyen_mai}', '${trang_thai}', '${description}')`;
        await pool.execute(sql);
        return res.redirect('/admin/products');
    }
}


module.exports = new AdminController;
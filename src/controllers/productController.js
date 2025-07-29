export const getProduct = (req, res) => {
    const { active, page } = req.query;
    res.json({
        message: "Product List",
        filters: {
            active: active,
            page: page
        }
    });
}

export const createProduct = (req, res) => {
    const { productName, productCode } = req.body;
    res.status(201).json({
        message: "Product Created",
        data: {
            name: productName,
            code: productCode
        }
    });
}
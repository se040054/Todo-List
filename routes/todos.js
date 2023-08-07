const express = require("express");
const router = express.Router();

const db = require("../models");
const Todo = db.Todo;

router.get("/", async (req, res, next) => {
  // throw new Error('error' , 'error happened') 同步錯誤
  console.log(req.user);
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const userId = req.user.id;
  const todos = await Todo.findAll({
    attributes: ["id", "name", "isDone"],
    where: { userId },
    offset: (page - 1) * limit,
    limit,
    raw: true,
  }).catch((error) => {
    error.errorMessage = "取得Todo清單時發生問題";
    next(error);
  });
  const { count } = await Todo.findAndCountAll().catch((error) => {
    error.errorMessage = "取得項目總數量發生問題";
    next(error);
  });
  const all = Math.ceil(count / limit);

  return res.render("todos", {
    todos,
    page,
    prev: page > 0 ? page - 1 : page,
    next: page < all ? page + 1 : page,
    all,
  });
});

router.get("/new", (req, res) => {
  // throw new Error('error' , 'error happened')
  return res.render("new");
});

router.post("/", (req, res, next) => {
  // throw new Error('error' , 'error happened')
  const name = req.body.name;
  const userId = req.user.id;
  return Todo.create({ name, userId })
    .then(() => {
      // throw new Error('error' , 'error happened')
      req.flash("success", "新增成功!");
      return res.redirect("/todos");
    })
    .catch((error) => {
      error.errorMessage = "新增失敗";
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  // throw new Error('error' , 'error happened')
  const id = req.params.id;
  const userId = req.user.id;
  return Todo.findByPk(id, {
    attributes: ["id", "name", "isDone", "userId"],
    raw: true,
  })
    .then((todo) => {
      // throw new Error('error' , 'error happened')
      if (!todo) {
        req.flash("error", "資料不存在");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      res.render("todo", { todo });
    })
    .catch((error) => {
      error.errorMessage = "取得此項目發生錯誤";
      next(error);
    });
});

router.get("/:id/edit", (req, res, next) => {
  // throw new Error('error' , 'error happened')
  const id = req.params.id;
  return Todo.findByPk(id, {
    attributes: ["id", "name", "isDone"],
    raw: true,
  })
    .then((todo) => {
      // throw new Error('error' , 'error happened')
      res.render("edit", { todo });
    })
    .catch((error) => {
      error.errorMessage = "取得項目編輯頁發生錯誤";
      next(error);
    });
});

router.put("/:id", (req, res, next) => {
  // throw new Error('error' , 'error happened')
  const { name, isDone } = req.body;
  const id = req.params.id;
  const userId = req.user.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isDone", "userId"],
  })
    .then((todo) => {
      // throw new Error('error' , 'error happened')
      if (!todo) {
        req.flash("error", "資料不存在");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      return todo.update({ name, isDone: isDone === "done" }).then(() => {
        req.flash("success", "更新成功");
        return res.redirect(`/todos/${id}`);
      });
    })
    .catch((error) => {
      error.errorMessage = "更新失敗";
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
  // throw new Error('error' , 'error happened')
  const id = req.params.id;
  const userId = req.user.id;
  return Todo.findByPk(id, {
    attributes: ["id", "name", "isDone", "userId"],
  })
    .then((todo) => {
      // throw new Error('error' , 'error happened')
      if (!todo) {
        req.flash("error", "資料不存在");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      return todo.destroy({ where: { id } }).then(() => {
        //throw new Error('error' , 'error happened')
        req.flash("success", "刪除成功!");
        res.redirect("/todos");
      });
    })
    .catch((error) => {
      error.errorMessage = "刪除失敗";
      next(error);
    });
});

module.exports = router;

# ShopEasy – Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PRODUCTS {
        INT id PK
        VARCHAR name
        VARCHAR category
        DECIMAL price
        DECIMAL discount_percent
        INT stock
        DECIMAL rating
        INT reviews
        VARCHAR image
        VARCHAR tag
        TEXT description
        TIMESTAMP created_at
    }

    ORDERS {
        INT id PK
        VARCHAR order_code UK
        VARCHAR customer_name
        VARCHAR phone
        VARCHAR email
        TEXT address
        DECIMAL total_amount
        VARCHAR payment_method
        VARCHAR status
        TIMESTAMP created_at
    }

    ORDER_ITEMS {
        INT id PK
        INT order_id FK
        INT product_id FK
        VARCHAR product_name
        DECIMAL price
        INT quantity
    }

    PAYMENTS {
        INT id PK
        INT order_id FK
        DECIMAL amount
        VARCHAR payment_method
        VARCHAR payment_status
        TIMESTAMP created_at
    }

    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS o|--o{ ORDER_ITEMS : included_in
    ORDERS ||--o{ PAYMENTS : has
```

## Relationship Description

| Relationship | Description |
|---|---|
| ORDERS – ORDER_ITEMS | One order can contain multiple order items. |
| PRODUCTS – ORDER_ITEMS | One product can appear in multiple order items. A product reference can be NULL. |
| ORDERS – PAYMENTS | One order can have multiple payment records. |

## Notes

- PK: Primary Key.
- FK: Foreign Key.
- UK: Unique Key.
- The database uses MySQL with InnoDB and utf8mb4.
- Product discounts are stored in `discount_percent`.
- The `order_items.price` field stores the product price used when the order is created.

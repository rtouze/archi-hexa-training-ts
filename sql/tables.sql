DROP TABLE IF EXISTS catalogue CASCADE;
CREATE TABLE catalogue (
    sku VARCHAR(100) NOT NULL PRIMARY KEY,
    gtin VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(256) NOT NULL,
    image VARCHAR(256),
    description VARCHAR(2000),
    price INTEGER NOT NULL DEFAULT 0,
    tax_rate DECIMAL NOT NULL DEFAULT 0.2
);

DROP TABLE IF EXISTS panier CASCADE;
CREATE TABLE panier (
    uuid UUID NOT NULL PRIMARY KEY
);

DROP SEQUENCE IF EXISTS seq_article;
CREATE SEQUENCE seq_article;
DROP TABLE IF EXISTS article CASCADE;
CREATE TABLE article (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT nextval('seq_article'),
    sku VARCHAR(100) NOT NULL REFERENCES catalogue(sku),
    quantity INTEGER NOT NULL DEFAULT 1,
    panier_id UUID NOT NULL REFERENCES panier(uuid),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO catalogue (sku, gtin, name, price) VALUES 
( 'slip-noir', '12345', 'Slip noir', 1000),
( 'slip-blanc', '12346', 'Slip blanc', 1000),
( 'chaussettes-noires', '12347', 'Chaussettes noires', 1500),
( 'chaussettes-blanches', '12348', 'Chaussettes blanches', 1000);

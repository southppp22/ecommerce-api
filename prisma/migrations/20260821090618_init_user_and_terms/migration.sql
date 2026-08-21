-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birth_date" DATE NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "zipcode" VARCHAR(10) NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_agreements" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "terms_id" INTEGER NOT NULL,
    "agreed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terms_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "terms_code_version_key" ON "terms"("code", "version");

-- CreateIndex
CREATE UNIQUE INDEX "terms_agreements_user_id_terms_id_key" ON "terms_agreements"("user_id", "terms_id");

-- AddForeignKey
ALTER TABLE "terms_agreements" ADD CONSTRAINT "terms_agreements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_agreements" ADD CONSTRAINT "terms_agreements_terms_id_fkey" FOREIGN KEY ("terms_id") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

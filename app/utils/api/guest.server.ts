import { db } from "~/utils/db.server";

export function getInvite(slug?: string) {
  return db.guest.findFirstOrThrow({
    where: {
      slug: slug,
    },
  });
}

export function getInvites() {
  return db.guest.findMany();
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function createInvite(name: string) {
  return db.guest.create({
    data: {
      name,
      slug: slugify(name),
    },
  });
}

export function deleteInvite(id: number) {
  return db.guest.delete({
    where: {
      id,
    },
  });
}

export function updateRSVPInvite(id: number, attending: boolean) {
  return db.guest.update({
    data: {
      attending,
    },
    where: { id },
  });
}

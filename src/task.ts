import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

const parseOrder = (title: string, id: number): number => {
  if (title && title.includes('#')) {
    return parseInt(title.split('#')[0]);
  } else if (title && !isNaN(parseInt(title))) {
    return parseInt(title);
  }
  return id;
};

const mapCategory = (
  category: Category,
  isTopLevel = true
): CategoryListElement => {
  const { id, Title, MetaTagDescription, name, children = [] } = category;

  const order = parseOrder(Title, id);

  return {
    id,
    name,
    image: MetaTagDescription,
    order,
    children: children
      .map((child) => mapCategory(child, false))
      .sort((a, b) => a.order - b.order),
    showOnHome: isTopLevel,
  };
};

const updateShowOnHome = (
  result: CategoryListElement[],
  showOnHome: number[]
): void => {
  if (result.length <= 5) {
    result.forEach((category) => (category.showOnHome = true));
  } else if (showOnHome.length > 0) {
    result.forEach(
      (category) => (category.showOnHome = showOnHome.includes(category.id))
    );
  } else {
    result.slice(0, 3).forEach((category) => (category.showOnHome = true));
  }
};

export const categoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  const { data } = await getCategories();
  if (!data) return [];

  const showOnHome: number[] = [];
  const result = data
    .map((category) => {
      const mappedCategory = mapCategory(category);
      if (category.Title?.includes('#')) showOnHome.push(category.id);
      return mappedCategory;
    })
    .sort((a, b) => a.order - b.order);

  updateShowOnHome(result, showOnHome);
  return result;
};

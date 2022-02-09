import Head from 'next/head';

// import products from '../../products.json';
import { fromImageToUrl, API_URL } from '../../utils/url';
import { twoDecimals } from '../../utils/format';

const Product = ({ product }) => {
	console.log(product);
	return (
		<div>
			<Head>
				{product.attributes.meta_title &&
					<title>{product.attributes.meta_title}</title>
				}
				{product.attributes.meta_description &&
					<meta name='description' content={product.attributes.meta_description} />
				}
			</Head>
			<h3>{product.attributes.name}</h3>
			<img src={fromImageToUrl(product.attributes.image.data.attributes)} />
			<h3>{product.attributes.name}</h3>
			<p>${twoDecimals(product.attributes.price)}</p>

			<p>
				{product.attributes.content}
			</p>
		</div >
	);
};

export async function getStaticProps({ params: { slug } }) {
	const product_res = await fetch(`${API_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`);
	const found = await product_res.json();

	return {
		props: {
			product: found.data[0]
		}
	};
}

export async function getStaticPaths() {
	const product_res = await fetch(`${API_URL}/api/products`);
	const products = await product_res.json();

	return {
		paths: products.data.map(product => ({
			params: { slug: String(product.attributes.slug) }
		})),
		fallback: false // shows 404 if the param is a no mach
	};
}


export default Product;
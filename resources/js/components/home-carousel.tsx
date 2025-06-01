import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    slides: {
        id: number;
        image: string;
        title: string;
        description: string;
        link: string;
    }[];
}

export function HomeCarousel({ slides }: CarouselProps) {
    const [current, setCurrent] = React.useState(0);

    const prev = () => setCurrent((current) => (current === 0 ? slides.length - 1 : current - 1));
    const next = () => setCurrent((current) => (current === slides.length - 1 ? 0 : current + 1));

    return (
        <div className="relative w-full overflow-hidden rounded-lg">
            <div className="relative h-[300px] md:h-[400px] w-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                            index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
                            <div className="flex h-full flex-col justify-center p-8 text-white">
                                <h2 className="mb-2 text-2xl font-bold md:text-4xl">{slide.title}</h2>
                                <p className="mb-4 max-w-md text-lg">{slide.description}</p>
                                <a
                                    href={slide.link}
                                    className="inline-flex w-fit items-center rounded-md bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-gray-100"
                                >
                                    Shop Now
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 w-2 rounded-full ${
                            index === current ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
